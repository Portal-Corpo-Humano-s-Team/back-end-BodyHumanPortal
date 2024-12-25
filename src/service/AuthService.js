import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_KEY = process.env.JWT_KEY || "chave_secreta";
console.log();

export default class AuthService {
  /**
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<object>} - Token JWT e dados do usuário autenticado
   * @throws {Error} - Caso o usuário ou a senha sejam inválidos
   */
  static async login(email, password) {
    // Verifica se o usuário existe pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Usuário ou senha inválidos");
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, birthday: user.birthday }, JWT_KEY);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
      },
    };
  }
}
