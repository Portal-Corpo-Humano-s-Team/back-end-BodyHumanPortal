import jwt, { JsonWebTokenError, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { IAuthRequest } from "../types/authTypes";
import { Response, NextFunction } from "express";
import env from "../types/env.ts";
import { IUser } from "../types/userTypes.ts";
import { ValidationError } from "../validations/CustomValidation.ts";

const key = env.JWT_KEY || "token-key";

function validateJwtToken(req: IAuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader: string = req.headers["authorization"];
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ValidationError("Token não fornecido ou mal formatado");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, key, (error: VerifyErrors, user: IUser) => {
      if (error) {
        throw new ValidationError("Token inválido ou expirado");
      }
      if (!user) {
        throw new ValidationError("Falha ao decodificar o token");
      }

      req.user = user;
      next();
    });
  } catch (error) {
    ValidationError.handleError(res, error);
  }
}

export default validateJwtToken;
