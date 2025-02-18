import { Router } from "express";
import EmailController from "../controllers/EmailController.ts";
import { validateRequiredField } from "../middleware/validateFields.ts";

const MODEL = "Email";
const emailRoutesInit = (app: Router) => {
  app.post("/auth/sendEmail", validateRequiredField(MODEL), EmailController.sendEmail);
};

export default emailRoutesInit;
