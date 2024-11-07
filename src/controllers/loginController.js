import user from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const key = "59b8fd20-b60e-4637-a035-483f989c21fe";

class loginRoutesInitController {
  static async login(req, res) {
    try {
      const { email, password } = req.body || {};

      // Verifica se email e senha foram fornecidos
      if (!email || !password) {
        return res.status(400).json({ message: "Usuário e senha são obrigatórios" });
      }
      // Busca o usuário apenas pelo email, pois a senha está criptografada
      const findedUser = await user.findOne({ email });

      // Verifica se o usuário foi encontrado
      if (!findedUser) {
        return res.status(401).json({ message: "Usuário/Senha inválidos" });
      }

      // Compara a senha fornecida com a senha armazenada no banco de dados
      const passwordMatch = await bcrypt.compare(password, findedUser.password);

      if (passwordMatch) {
        // Gera o token JWT se a senha estiver correta
        const token = jwt.sign({ email: findedUser.email }, key);
        return res.status(200).json({ message: "Autenticado", token });
      } else {
        return res.status(401).json({ message: "Usuário/Senha inválidos" });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ message: "Erro no servidor" });
    }
  }
}

export default loginRoutesInitController;
