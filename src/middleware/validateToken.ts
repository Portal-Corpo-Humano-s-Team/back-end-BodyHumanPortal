import jwt, { JsonWebTokenError, JwtPayload, VerifyErrors } from "jsonwebtoken";
import { IAuthRequest } from "../types/authTypes";
import { Response, NextFunction } from "express";
import env from "../types/env.ts";
import { IUser } from "../types/userTypes.ts";

const key = env.JWT_KEY || "token-key";

function validateJwtToken(req: IAuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader: string = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, key, (error: VerifyErrors, user: IUser) => {
      if (error) {
        return res.status(403).json({ message: "Token inválido ou expirado", error: error.message });
      }
      if (!user) {
        return res.status(403).json({ message: "Falha ao decodificar o token" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default validateJwtToken;
