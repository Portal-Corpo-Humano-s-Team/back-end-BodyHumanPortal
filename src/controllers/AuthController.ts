import AuthService from "../service/AuthService.ts";
import { Request, Response } from "express";
import { IUser } from "../types/userTypes.ts";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation.ts";

export default class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUser;

      if (!email || !password) {
        throw new ValidationError("Email e senha são obrigatórios");
      }

      const result = await AuthService.login(email, password);

      SuccessResponse.send(res, 201, "Usuário autenticado com sucesso", result.token);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
