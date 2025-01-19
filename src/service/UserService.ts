import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { prisma } from "../config/connectDb.ts";
import { IUser } from "../types/userTypes.ts";
import { ValidationError } from "../validations/CustomValidation.ts";

export default class UserService {
  static async createUser(payload): Promise<IUser> {
    const { name, email, password, birthday } = payload;

    if (await prisma.user.findUnique({ where: { email } })) {
      throw new ValidationError("Email já cadastrado");
    }

    const formattedDate = new Date(`${birthday}T00:00:00Z`).toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = await prisma.user.create({
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
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        emails: true,
      },
    });
  }

  static async getUserById(userId) {
    const user = prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
      },
    });

    if (!user) throw new ValidationError("Usuário não encontrado");
    return user;
  }

  static async updateUser(userId: IUser["id"], payload: IUser) {
    if (!ObjectId.isValid(userId)) {
      throw new ValidationError("ID inválido: o ID fornecido não é um ObjectId válido.");
    }

    if (!userId) {
      throw new ValidationError("ID Inválido: usuário não encontrado.");
    }

    return prisma.user.update({
      where: { id: userId },
      data: payload,
    });
  }

  static async deleteUser(userId) {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!ObjectId.isValid(userId)) {
      throw new ValidationError("ID inválido: o ID fornecido não é um ObjectId válido.");
    }
    if (!userExists) {
      throw new ValidationError("ID Inválido: usuário não encontrado.");
    }

    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
