import EmailService from "../service/EmailService";
import { Response } from "express";
import { IAuthRequest } from "../types/authTypes";
import { IUser } from "../types/userTypes";
import { ETemplateEmail } from "@prisma/client";
import { ValidationError, SuccessResponse } from "../validations/CustomValidation";

export default class EmailController {
  static async sendEmail(req: IAuthRequest, res: Response) {
    const { templateEmail }: { templateEmail: keyof typeof ETemplateEmail } = req.body;

    try {
      const userId: IUser["id"] = req.user.id;
      const to: IUser["email"] = req.user.email;

      if (!Object.values(ETemplateEmail).includes(templateEmail as ETemplateEmail)) {
        throw new ValidationError(`Invalid template type: ${templateEmail}`);
      }

      await EmailService.sendEmail({ to, userId, templateEmail: ETemplateEmail[templateEmail] }, req.user);

      SuccessResponse.send(res, 200, "Email enviado com sucesso");
    } catch (error) {
      ValidationError.handleError(res, error);
    }
  }
}
