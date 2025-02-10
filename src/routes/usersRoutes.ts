import UserController from "../controllers/UserController.js";
import { validateRequiredField } from "../middleware/validateFields.js";
import { Router } from "express";

const MODEL = "User";
const userRoutesInit = (app: Router) => {
  app.post("/users", UserController.createUser);
  app.get("/auth/users", UserController.getAllUsers);
  app.get("/users/:id", UserController.getUserById);
  app.put("/users/:id", validateRequiredField(MODEL), UserController.updateUser);
  app.delete("/auth/users/:id", UserController.deleteUser);
};

export default userRoutesInit;
