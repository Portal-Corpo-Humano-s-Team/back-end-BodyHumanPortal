import { Router } from "express";
import EmailController from "../controllers/EmailController";
import { validateRequiredField } from "../middleware/validateFields";

const MODEL = "Email";
const emailRoutesInit = (app: Router) => {
  app.post("/auth/sendEmail", validateRequiredField(MODEL), EmailController.sendEmail);
};

export default emailRoutesInit;
