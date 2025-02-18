import UserService from "../service/UserService.js";
import EmailService from "../service/EmailService";
import type { Request, Response } from "express";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation";
import { IMailParams } from "../types/emailTypes";

export default class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, birthday, confirmPassword, password } = req.body;
      const templateEmail: IMailParams["templateEmail"] = "WELCOME";
      console.log(req.body);
      if (!name || !email || !birthday || !password || !confirmPassword) {
        throw new ValidationError("Todos os campos são obrigatórios.");
      }

      if (!email.includes("@")) {
        throw new ValidationError("Informe um email válido");
      }

      const user = await UserService.createUser({ name, email, birthday, password, confirmPassword });
      await EmailService.sendEmail({ to: email, userId: user.id, templateEmail }, user);

      SuccessResponse.send(res, 201, "Usuário criado com sucesso!", user);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      SuccessResponse.send(res, 200, "Usuários listados com sucesso", users);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.updateUser(req.params.id, req.body);
      SuccessResponse.send(res, 200, "Usuário alterado com sucesso", newUser);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await UserService.deleteUser(req.params.id);
      SuccessResponse.send(res, 200, "Usuário deletado com sucesso");
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
