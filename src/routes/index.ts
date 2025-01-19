import { Router, Request, Response } from "express";
import validateJwtToken from "../middleware/validateToken.js";
import userRoutesInit from "./usersRoutes.js";
import authRoutesInit from "./authRoutes.js";
import emailRoutesInit from "./emailRoutes.js";
import { SuccessResponse } from "../validations/CustomValidation.js";

const routes = (app: Router) => {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ sucess: true, message: "Servers Running" });
  });
  app.use("/auth", validateJwtToken);

  userRoutesInit(app);
  authRoutesInit(app);
  emailRoutesInit(app);
};

export default routes;
