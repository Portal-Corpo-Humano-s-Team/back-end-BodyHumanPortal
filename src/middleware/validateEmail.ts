import { Response, NextFunction } from "express";
import { IAuthRequest } from "../types/authTypes.ts";
import { ValidationError } from "../validations/CustomValidation.ts";
import { IUser } from "../types/userTypes.ts";
import { validateEmailDomain } from "../validations/validationEmail.ts";

export default async function validateEmailRequest(req: IAuthRequest, res: Response, next: NextFunction) {
  try {
    const { email }: IUser = req.body.email ? req.body : req.user || {};
    if (!email) {
      throw new ValidationError("Email not provided");
    }

    await validateEmailDomain(email);
    next();
  } catch (error) {
    ValidationError.handleError(res, error);
  }
}
