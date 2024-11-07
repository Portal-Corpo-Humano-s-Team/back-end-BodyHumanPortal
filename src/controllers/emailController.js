import user from "../models/User.js";
import nodemailer from "nodemailer";
import SMTP from "../config/smtp.js";
import { text } from "express";

class emailController {
  static async sendEmail({ to, subject, message }) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: SMTP.user,
          pass: SMTP.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Envio do e-mail
      const mailSent = await transporter.sendMail({
        from: SMTP.from,
        to,
        subject,
        text: message,
      });

      console.log("E-mail enviado para:", to);
      return mailSent;
    } catch (error) {
      console.error("Erro ao enviar o e-mail: ", error);
      throw new Error("Erro ao enviar o e-mail");
    }
  }

  static async sendWelcomeEmail(req, res) {
    const subject = "Bem-vindo ao nosso sistema!";
    const message = `Olá ${req.body.email},\n\nSeja bem-vindo ao Portal do Corpo Humano! Estamos felizes por tê-lo conosco.`;
    await this.sendEmail({ to: req.body.email, subject, message });
  }

  static async sendNotificationEmail(req, res) {
    try {
      console.log("Requisição recebida:", req.body);

      const { subject, message } = req.body;
      const from = req.user.email;

      const User = await user.findOne({ email: from });
      if (!User) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const emailResponse = await this.sendEmail({ to: from, subject, message });

      const newEmail = {
        subject: subject,
        message: message,
        to: from,
        dateSent: new Date(),
      };

      User.emailsEnviados.push(newEmail);
      await User.save();

      res.status(200).json({ message: "E-mail enviado e salvo com sucesso!" });
    } catch (error) {
      console.error("Erro ao enviar o e-mail: ", error);
      res.status(500).json({ message: "Erro ao enviar o e-mail", error: error.message });
    }
  }

  static async emailsSent(req, res) {
    const email = req.user.email;

    try {
      // Busca o usuário pelo e-mail
      const userFound = await user.findOne({ email });

      if (!userFound) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Pega o array de e-mails enviados e ordena pela data de envio
      const emailsEnviados = userFound.emailsEnviados.sort((a, b) => b.dateSent - a.dateSent).slice(0, 4); // Limita a 8 e-mails mais recentes

      res.json(emailsEnviados);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar e-mails." });
    }
  }
}

export default emailController;
