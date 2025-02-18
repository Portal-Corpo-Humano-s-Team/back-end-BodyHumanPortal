import AuthController from "../controllers/AuthController.ts";
import validateJwtToken from "../middleware/validateToken.ts";
import { IAuthRequest } from "../types/authTypes.ts";
import { Response, Router } from "express";

const authRoutesInit = (app: Router) => {
  app.post("/login", AuthController.login);
  app.post("/login/validateToken/:email", AuthController.validate2FAToken);
  app.get("/login/getUser", validateJwtToken, AuthController.getUserProps);

  app.get("/auth/protected", (req: IAuthRequest, res: Response) => {
    res.status(200).json({ message: "Acesso autorizado a rota protegida!", user: req.user });
  });
};

export default authRoutesInit;
