import UserService from "../service/UserService.js";
import EmailService from "../service/EmailService.ts";
import type { Request, Response } from "express";
import { ValidationError } from "../validations/CustomValidation.ts";
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

      res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) res.status(404).json({ error: "Usuário não encontrado" });
      res.status(200).json({ user });
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
