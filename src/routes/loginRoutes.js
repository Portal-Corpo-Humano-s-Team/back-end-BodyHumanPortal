import loginController from "../controllers/loginController.js";
import validateToken from "../middleware/validateToken.js";

const loginRoutesInit = (app) => {
  app.post("/login", loginController.login); // Para logar um novo usuário
};

export default loginRoutesInit;
