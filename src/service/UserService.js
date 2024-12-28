import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { prisma } from "../config/connectDb.js";

export default class UserService {
  static async createUser(payload = {}) {
    const { name, email, password, birthday } = payload;

    if (await prisma.User.findUnique({ where: { email } })) {
      throw new Error("Email já cadastrado");
    }

    const formattedDate = new Date(`${birthday}T00:00:00Z`).toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.User.create({
      data: {
        name,
        email,
        birthday: formattedDate,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: formattedDate,
    };
  }

  static async getAllUsers() {
    return prisma.User.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
      },
    });
  }

  static async getUserById(userId) {
    return prisma.User.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
      },
    });
  }

  static async updateUser(userId, payload = {}) {
    if (!ObjectId.isValid(userId)) {
      throw new Error("ID inválido: o ID fornecido não é um ObjectId válido.");
    }

    if (!userId) {
      throw new Error("ID Inválido: usuário não encontrado.");
    }

    return prisma.User.update({
      where: { id: userId },
      payload,
    });
  }

  static async deleteUser(userId) {
    const userExists = await prisma.User.findUnique({
      where: { id: userId },
    });

    if (!ObjectId.isValid(userId)) {
      throw new Error("ID inválido: o ID fornecido não é um ObjectId válido.");
    }
    if (!userExists) {
      throw new Error("ID Inválido: usuário não encontrado.");
    }

    return prisma.User.delete({
      where: { id: userId },
    });
  }
}
