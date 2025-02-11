import { Router } from "express";
import EmailController from "../controllers/EmailController";
import { validateRequiredField } from "../middleware/validateFields";
import validateEmailRequest from "../middleware/validateEmail";

const MODEL = "Email";
const emailRoutesInit = (app: Router) => {
  app.post("/auth/sendEmail", validateRequiredField(MODEL), validateEmailRequest, EmailController.sendEmail);
};

export default emailRoutesInit;
