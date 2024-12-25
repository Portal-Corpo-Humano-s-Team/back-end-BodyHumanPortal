import { PrismaClient } from "@prisma/client";
import SMTP from "../config/smtp.js";
import { generateTemplateWelcomeEmail } from "../templates/emailTemplate.js";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default class EmailService {
  static async sendEmail({ to, subject, message, userId }) {
    const transporter = nodemailer.createTransport({
      host: SMTP.host,
      port: SMTP.port,
      secure: false,
      auth: {
        user: SMTP.user,
        pass: SMTP.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailSent = await transporter.sendMail({
      from: SMTP.from,
      to: to,
      subject: subject,
      text: message,
    });

    await prisma.Email.create({
      data: {
        userId,
        to,
        subject,
        message,
        dateSent: new Date(),
      },
    });

    console.log("E-mail enviado para:", to);
    return mailSent;
  }

  static sendWelcomeEmail(user = {}) {
    const templateEmail = generateTemplateWelcomeEmail(user);
    this.sendEmail(templateEmail);
  }
}
