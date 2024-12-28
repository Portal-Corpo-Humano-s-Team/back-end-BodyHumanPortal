import AuthService from "../service/AuthService.js";

export default class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      const result = await AuthService.login(email, password);

      return res.status(200).json({
        message: "Login realizado com sucesso",
        token: result.token,
      });
    } catch (error) {
      console.error("Erro no login:", error.message);
      return res.status(401).json({ message: "Erro no login:", error: error.message });
    }
  }
}
