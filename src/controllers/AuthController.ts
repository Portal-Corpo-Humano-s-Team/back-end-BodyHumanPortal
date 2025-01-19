import AuthService from "../service/AuthService.ts";
import { Request, Response } from "express";
import { IUser } from "../types/userTypes.ts";

export default class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUser;

      if (!email || !password) {
        res.status(400).json({ message: "Email e senha são obrigatórios" });
        return;
      }

      const result = await AuthService.login(email, password);

      res.status(200).json({
        message: "Login realizado com sucesso",
        token: result.token,
      });
    } catch (error) {
      console.error("Erro no login:", error.message);
      res
        .status(401)
        .json({ message: "Não foi possível realizar o login. tente novamente mais tarde:", error: error.message });
    }
  }
}
