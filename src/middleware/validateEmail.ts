import { Response, NextFunction } from "express";
import { IAuthRequest } from "../types/authTypes";
import { ValidationError } from "../validations/CustomValidation";
import { IUser } from "../types/userTypes";
import { validateEmailDomain } from "../validations/validationEmail";

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
