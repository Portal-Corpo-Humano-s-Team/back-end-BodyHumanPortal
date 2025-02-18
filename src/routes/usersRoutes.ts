import UserController from "../controllers/UserController.js";
import { Router } from "express";

const userRoutesInit = (app: Router) => {
  app.post("/users", UserController.createUser);
  app.get("/auth/users", UserController.getAllUsers);
  app.put("/users/:id", UserController.updateUser);
  app.delete("/auth/users/:id", UserController.deleteUser);
};

export default userRoutesInit;
