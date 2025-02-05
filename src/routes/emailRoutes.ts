import { Router } from "express";
import EmailController from "../controllers/EmailController.ts";
import { validateRequiredField } from "../middleware/validateFields.ts";
import validateEmailRequest from "../middleware/validateEmail.ts";

const MODEL = "Email";
const emailRoutesInit = (app: Router) => {
  app.post("/auth/sendEmail", validateRequiredField(MODEL), validateEmailRequest, EmailController.sendEmail);
};

export default emailRoutesInit;
