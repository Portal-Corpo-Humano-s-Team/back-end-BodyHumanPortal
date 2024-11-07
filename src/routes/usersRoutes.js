import userController from "../controllers/userController.js";
import validateToken from "../middleware/validateToken.js";

const userRoutesInit = (app) => {
  // Operações CRUD sobre o recurso "users"
  app.get("/logged-user", validateToken, userController.getLoggedUser); // Para obter os usuários
  app.get("/users", userController.getUsers); // Para obter os usuários
  app.post("/users", userController.postUser); // Para criar um novo usuário
  app.delete("/users", userController.deleteUser); // Para deletar todos os usuários
  app.patch("/update", validateToken, userController.updateUser); // Para atualizar um usuário
};

export default userRoutesInit;
