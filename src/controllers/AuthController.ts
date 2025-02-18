import AuthService from "../service/AuthService.ts";
import { Request, Response } from "express";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation.ts";
import { IAuthRequest } from "../types/authTypes.ts";

export default class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password, googleToken } = req.body;

      const result = await AuthService.login(email, password, googleToken);

      SuccessResponse.send(res, 202, "Um código foi enviado para o seu email", result);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async validate2FAToken(req: Request, res: Response) {
    const { email } = req.params;
    const { token } = req.body;

    try {
      const validation = await AuthService.verify2FAToken(email, token);
      console.log(validation);
      SuccessResponse.send(res, 200, "Login efetuado com sucesso.", validation);
    } catch (error) {
      console.log(error.message);
      ValidationError.handleError(res, error);
    }
  }

  static async getUserProps(req: IAuthRequest, res: Response) {
    const { id } = req.user;

    try {
      const User = await AuthService.getUserProps(id);
      SuccessResponse.send(res, 200, "Token decodificado com sucesso", User);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
