import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/connectDb.ts";
import { User } from "@prisma/client";
import { ETemplateEmail } from "@prisma/client";
import {
  IUser,
  IUserLoginTotp,
  IUserLoginWithGoogle,
  IUserVerifyTotpToken,
  TGeneralLogin,
} from "../types/userTypes.ts";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation.ts";
import speakeasy from "speakeasy";
import { redisClient } from "../config/connectRedis.ts";
import EmailService from "./EmailService.ts";
import env from "../types/env.ts";
import { OAuth2Client } from "google-auth-library";
import { EAuthMethod } from "@prisma/client";

const JWT_KEY = process.env.JWT_KEY || "chave_secreta";
const GoogleId = env.GOOGLE_CLIENT_ID;
const GoogleClient = new OAuth2Client(GoogleId);

export default class AuthService {
  static async login(email?: User["email"], password?: User["password"], googleToken?: string): Promise<TGeneralLogin> {
    console.log(googleToken);
    if (googleToken) {
      const data = await this.loginWithGoogle(googleToken);
      return data;
    }
    console.log("passou aqui 2");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ValidationError("Usuário ou senha inválidos");
    }

    const passwordMatch: boolean = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ValidationError("Usuário ou senha inválidos");
    }

    await this.generateToken(user.email, user.name, user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  static async loginWithGoogle(token: string): Promise<IUserLoginWithGoogle | IUserLoginTotp> {
    const ticket = await GoogleClient.verifyIdToken({
      idToken: token,
      audience: GoogleId,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if (!payload) {
      throw new ValidationError("Falha na autenticação com Google");
    }

    const { email, name, sub } = payload;

    let user = await prisma.user.findFirst({ where: { email } });
    console.log(user);

    if (user && user.authMethod == EAuthMethod.LOCAL) {
      console.info("stay on validation");
      console.info(user.id);
      console.info(user.authMethod);
      await prisma.user.update({
        where: { id: user.id },
        data: { authMethod: EAuthMethod.BOTH, googleSub: sub },
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          authMethod: EAuthMethod.GOOGLE,
          googleSub: sub,
        },
      });
    }

    if (!payload.email_verified) {
      await this.generateToken(user.email, user.name, user.id);
      return {
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } else {
      const JwtToken: string = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_KEY);
      return {
        token: JwtToken,
      };
    }
  }
  static async generateToken(email: IUser["email"], name: IUser["name"], id: IUser["id"]) {
    const secret = speakeasy.generateSecret().base32;

    const redisKey = `totp:${email}`;
    console.log(redisKey);

    const existsToken = await redisClient.get(redisKey);

    if (existsToken) {
      throw new ValidationError("Um código TOTP já foi enviado recentemente. Aguarde antes de gerar outro.");
    }

    const token = speakeasy.totp({
      secret,
      encoding: "base32",
      step: 180,
    });
    const letterToken = token.split("");
    const resultToken = {
      1: letterToken[0],
      2: letterToken[1],
      3: letterToken[2],
      4: letterToken[3],
      5: letterToken[4],
      6: letterToken[5],
    };
    const emailParams = { email, name, ...resultToken };

    await EmailService.sendEmail({ to: email, userId: id, templateEmail: ETemplateEmail.TWOFACTORAUTH }, emailParams);

    const cacheData = JSON.stringify({
      secret,
      token,
    });

    await redisClient.setEx(redisKey, 180, cacheData);
  }

  static async verify2FAToken(userEmail: IUser["email"], token: string): Promise<IUserVerifyTotpToken> {
    const redisKey = `totp:${userEmail}`;
    const cacheData = await redisClient.get(redisKey);
    console.log(userEmail, token, cacheData);

    if (!cacheData) {
      throw new ValidationError(`Token ${token} Expirado `);
    }
    const { secret } = JSON.parse(cacheData);

    if (!secret) {
      throw new ValidationError("Nenhuma chave 2FA ativa encontrada no cache.");
    }

    const isValid = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      step: 180,
      window: 0,
    });

    if (isValid) {
      await redisClient.del(redisKey);

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          name: true,
          email: true,
          birthday: true,
          authMethod: true,
        },
      });

      const JwtToken: string = jwt.sign(
        { id: user.id, email: user.email, name: user.name, birthday: user.birthday, authMethod: user.authMethod },
        JWT_KEY
      );
      return {
        isValid,
        token: JwtToken,
      };
    } else {
      throw new ValidationError("Código 2FA inválido");
    }
  }
}
