import { SMTP, payloadTransporter } from "../config/payloadEmailTransporter.js";
import { generateTemplateWelcomeEmail } from "../templates/emailTemplate.js";
import nodemailer from "nodemailer";
import { prisma } from "../config/connectDb.js";

export default class EmailService {
  static async sendEmail({ to, subject, message, userId }) {
    const transporter = nodemailer.createTransport(payloadTransporter);

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
