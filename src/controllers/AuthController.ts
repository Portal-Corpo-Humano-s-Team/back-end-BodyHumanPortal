import AuthService from "../service/AuthService";
import { Request, Response } from "express";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation";

export default class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password, googleToken } = req.body;

      const result = await AuthService.login(email, password, googleToken);

      console.log(result);
      SuccessResponse.send(res, 202, "Token temporário enviado com sucesso", result);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async validate2FAToken(req: Request, res: Response) {
    const { email } = req.params;
    const { token } = req.body;

    try {
      const validation = await AuthService.verify2FAToken(email, token);

      SuccessResponse.send(res, 200, "Token TOTP validado com sucesso.", validation);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
