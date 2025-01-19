import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/connectDb.ts";
import { User } from "@prisma/client";
import { IUserLogin } from "../types/userTypes.ts";
import { ValidationError } from "../validations/CustomValidation.ts";

const JWT_KEY = process.env.JWT_KEY || "chave_secreta";

export default class AuthService {
  static async login(email: User["email"], password: User["password"]): Promise<IUserLogin> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ValidationError("Usuário ou senha inválidos");
    }

    const passwordMatch: boolean = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ValidationError("Usuário ou senha inválidos");
    }

    const token: IUserLogin["token"] = jwt.sign(
      { id: user.id, email: user.email, name: user.name, birthday: user.birthday },
      JWT_KEY
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
      },
    };
  }
}
