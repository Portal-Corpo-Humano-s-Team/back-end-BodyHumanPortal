import UserController from "../controllers/UserController.js";
import validateToken from "../middleware/validateToken.js";

const userRoutesInit = (app) => {
  // Operações CRUD sobre o recurso "users"
  app.post("/users", UserController.createUser);
  app.get("/users", UserController.getAllUsers);
  app.get("/users/:id", UserController.getUserById);
  app.get("/users/:id", UserController.getUserById);
  app.put("/users/:id", UserController.updateUser);
  app.delete("/users/:id", UserController.deleteUser);

  // app.get("/logged-user", validateToken, userController.getLoggedUser); // Para obter os usuários
  // app.delete("/users", userController.deleteUser); // Para deletar todos os usuários
  // app.post("/feedback", userController.postFeedback);
  // app.patch("/update", validateToken, userController.updateUser); // Para atualizar um usuário
};

export default userRoutesInit;
