import emailController from "../controllers/emailController.js";
import validateToken from "../middleware/validateToken.js";

const emailRoutesInit = (app) => {
  // Usando bind para garantir que o contexto de 'this' seja preservado
  app.post("/user/sendWelcome", emailController.sendWelcomeEmail.bind(emailController));
  app.post("/users/sendHelpEmail", validateToken, emailController.sendNotificationEmail.bind(emailController));
  app.get("/users/sentEmail", validateToken, emailController.emailsSent);
};

export default emailRoutesInit;
