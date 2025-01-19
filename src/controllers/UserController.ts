import UserService from "../service/UserService.js";
import EmailService from "../service/EmailService.ts";
import type { Request, Response } from "express";
import { SuccessResponse, ValidationError } from "../validations/CustomValidation.ts";
import { IMailParams } from "../types/emailTypes.ts";

export default class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, birthday, password } = req.body;
      const templateEmail: IMailParams["templateEmail"] = "WELCOME";

      if (!name || !email || !password || !birthday) {
        throw new ValidationError("Todos os campos são obrigatórios.");
      }

      if (!email.includes("@")) {
        throw new ValidationError("Informe um email válido");
      }

      const user = await UserService.createUser({ name, email, birthday, password });
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

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) throw new ValidationError("Usuário não encontrado");
      SuccessResponse.send(res, 200, "Usuário encontrado com sucesso", user);
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
