import express from "express";
import validateJwtToken from "../middleware/validateToken.js";
import userRoutesInit from "./usersRoutes.js";
import authRoutesInit from "./authRoutes.js";
import emailRoutesInit from "./emailRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("Server's Running"));
  app.use("/auth", validateJwtToken);

  userRoutesInit(app);
  authRoutesInit(app);
  emailRoutesInit(app);
};

export default routes;
