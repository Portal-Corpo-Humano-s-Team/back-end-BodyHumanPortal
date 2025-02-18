import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { prisma } from "../config/connectDb.ts";
import { IUser } from "../types/userTypes.ts";
import { User } from "@prisma/client";
import { ValidationError } from "../validations/CustomValidation.ts";
import { EAuthMethod } from "@prisma/client";

export default class UserService {
  static async createUser(payload: any): Promise<IUser> {
    const { name, email, password, confirmPassword, birthday } = payload;

    if (await prisma.user.findUnique({ where: { email } })) {
      throw new ValidationError("Email já cadastrado");
    }
    console.log(payload);
    if (password !== confirmPassword) {
      throw new ValidationError("Senhas não conferem");
    }

    const formattedDate = new Date(`${birthday}`).toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = await prisma.user.create({
      data: {
        name,
        email,
        authMethod: EAuthMethod.LOCAL,
        birthday: formattedDate,
        password: hashedPassword,
        createAccount: new Date(),
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: formattedDate,
      authMethod: user.authMethod,
      createAccount: user.createAccount,
    };
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        authMethod: true,
        googleSub: true,
        profilePicture: true,
        emails: true,
      },
    });
  }

  static async updateUser(userId: User["id"], payload: User) {
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
