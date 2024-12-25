import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default class UserService {
  static async createUser(payload = {}) {
    const { name, email, password, birthday } = payload;

    if (await prisma.User.findUnique({ where: { email } })) {
      throw new Error("Email já cadastrado");
    }

    const formattedDate = new Date(birthday + "T00:00:00.000Z");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.User.create({
      data: {
        name,
        email,
        birthday,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
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

  static async updateUser(userId, data) {
    return prisma.User.update({
      where: { id: userId },
      data,
    });
  }

  static async deleteUser(userId) {
    return prisma.User.delete({
      where: { id: userId },
    });
  }
}
