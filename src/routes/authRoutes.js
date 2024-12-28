import AuthController from "../controllers/AuthController.js";
import validateJwtToken from "../middleware/validateToken.js";

const authRoutesInit = (app) => {
  app.post("/login", AuthController.login);

  // Rotas protegidas, onde o token é obrigatório
  app.get("/auth/protected", (req, res) => {
    res.status(200).json({ message: "Acesso autorizado a rota protegida!", user: req.user });
  });
};

export default authRoutesInit;
