import user from "../models/User.js";
import Feedback from "../models/Feedback.js";
import nodemailer from "nodemailer";
import emailController from "./emailController.js";
import bcrypt from "bcrypt";
import SMTP from "../config/smtp.js";
import { text } from "express";

class userController {
  static async getLoggedUser(req, res) {
    try {
      const getedUsers = await user.findOne({ email: req.user.email });
      res.status(200).json(getedUsers);
    } catch (error) {
      res.status(500).json({ message: `${error.message} - error be find users` });
    }
  }

  static async getUsers(req, res) {
    try {
      const getedUsers = await user.find({});
      res.status(200).json({ message: "Users finded sucefully", Users: getedUsers });
    } catch (error) {
      res.status(500).json({ message: `${error.message} - error be find users` });
    }
  }

  static async postUser(req, res) {
    console.log("Requisição recebida:", req.body);
    try {
      const { email, name, birthday, password } = req.body;

      const saltRounds = 10; // Define o custo da geração do salt (número de iterações)
      const salt = await bcrypt.genSalt(saltRounds);

      // Criptografa a senha usando o salt gerado
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await user.create({
        name,
        email,
        birthday,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User created successfully" + newUser });
    } catch (error) {
      console.error("Erro ao criar usuário:", error); // Adicione esta linha para logar erros
      res.status(500).json({ message: `${error.message} - Create user failed` });
    }
  }

  static async encryptPassword(password) {
    const saltRounds = 10; // Define o custo da geração do salt (número de iterações)

    try {
      // Gera o salt
      const salt = await bcrypt.genSalt(saltRounds);

      // Criptografa a senha usando o salt gerado
      const hashedPassword = await bcrypt.hash(password, salt);

      // Retorna a senha criptografada
      return hashedPassword;
    } catch (error) {
      console.error("Erro ao criptografar a senha:", error);
    }
  }

  static async deleteUser(req, res) {
    try {
      const deletedUsers = await user.deleteMany({});
      res.status(201).json({ message: "Deleted users successfully", deletedCount: deletedUsers.deletedCount });
    } catch (error) {
      res.status(500).json({ message: `${error.message} - Delete users failed` });
    }
  }

  static async updateUser(req, res) {
    const { email, newPassword, currentPassword } = req.body;

    try {
      const userId = req.user.id;
      const existingUser = await user.findById(userId); // Busca o usuário pelo ID

      // Verifica se o e-mail foi fornecido e se já está em uso
      if (email) {
        const emailExists = await user.findOne({ email });
        if (emailExists && emailExists.id.toString() !== userId) {
          return res.status(400).json({ message: "Email já está em uso." });
        }
        ("");
        await user.updateOne({ id: userId }, { email }); // Atualiza o e-mail
      }

      // Verifica se a nova senha foi fornecida
      if (newPassword) {
        // Verifica se a senha atual corresponde à senha armazenada
        const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Senha atual não está correta." });
        }

        // Se a senha atual estiver correta, atualiza a nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.findByIdAndUpdate(userId, { password: hashedPassword });
      }

      res.status(200).json({ message: "Atualização bem-sucedida!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar informações." });
    }
  }

  static async postFeedback(req, res) {
    console.log("Requisição recebida:", req.body);
    try {
      const { name, phoneNumber, email, navegationScore, appearanceScore } = req.body;

      const newFeedback = await Feedback.create({
        name,
        email,
        phoneNumber,
        navegationScore,
        appearanceScore,
      });

      res.status(201).json({ message: "User created successfully" + newFeedback });
    } catch (error) {
      console.error("Erro ao criar usuário:", error); // Adicione esta linha para logar erros
      res.status(500).json({ message: `${error.message} - Create user failed` });
    }
  }
}

export default userController;
