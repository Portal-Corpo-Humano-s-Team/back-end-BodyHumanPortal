import EmailController from "../controllers/EmailController.js";
import validateToken from "../middleware/validateToken.js";

const emailRoutesInit = (app) => {
  // Usando bind para garantir que o contexto de 'this' seja preservado
  app.post("/auth/sendEmail", EmailController.sendEmail);
};

export default emailRoutesInit;
