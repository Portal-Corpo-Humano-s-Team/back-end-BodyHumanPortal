import EmailController from "../controllers/EmailController.js";
import { validateRequiredField } from "../middleware/validateFields.js";

const MODEL = "Email";
const emailRoutesInit = (app) => {
  // Usando bind para garantir que o contexto de 'this' seja preservado
  app.post("/auth/sendEmail", validateRequiredField(MODEL), EmailController.sendEmail);
};

export default emailRoutesInit;
