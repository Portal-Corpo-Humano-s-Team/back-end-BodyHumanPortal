import UserService from "../service/UserService.js";
import EmailService from "../service/EmailService.js";

export default class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, birthday, password } = req.body;

      if (!name || !email || !password || !birthday) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const user = await UserService.createUser({ name, email, password });
      console.log(user.id);
      EmailService.sendWelcomeEmail({ name, email, userId: user.id });

      return res.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar o usuário" });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send({ Message: "Usuário deletado com sucesso" }); // No Content
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  }
}
