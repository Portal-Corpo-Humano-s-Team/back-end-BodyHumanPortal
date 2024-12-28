import UserController from "../controllers/UserController.js";
import { validateRequiredField } from "../middleware/validateFields.js";

const MODEL = "User";
const userRoutesInit = (app) => {
  // Operações CRUD sobre o recurso "users"
  app.post("/users", validateRequiredField(MODEL), UserController.createUser);
  app.get("/users", UserController.getAllUsers);
  app.get("/users/:id", UserController.getUserById);
  app.put("/users/:id", validateRequiredField(MODEL), UserController.updateUser);
  app.delete("/users/:id", UserController.deleteUser);
};

export default userRoutesInit;
