import { SMTP, payloadTransporter } from "../config/payloadEmailTransporter.js";
import { generateTemplateWelcomeEmail } from "../templates/emailTemplate.js";
import nodemailer from "nodemailer";
import { prisma } from "../config/connectDb.js";
import Mustache from "mustache";
import mjml2html from "mjml";
import fs from "fs";

const TemplateType = {
  WELCOME: "welcome",
};

const getHtmlTemplate = (type) => {
  const mjmlTemplate = fs.readFileSync(`./src/templates/${type}.mjml`, "utf-8");
  return mjml2html(mjmlTemplate, { filePath: `./src/templates` }).html;
};

const templates = {
  [TemplateType.WELCOME]: getHtmlTemplate(TemplateType.WELCOME),
};

export default class EmailService {
  static async sendEmail({ to, subject, userId }, data) {
    const transporter = nodemailer.createTransport(payloadTransporter);
    const template = templates[TemplateType.WELCOME];
    console.log(data);
    const html = Mustache.render(template, data);

    const mailSent = transporter.sendMail({
      from: SMTP.from,
      to: to,
      subject: subject,
      html: html,
    });

    prisma.Email.create({
      data: {
        userId,
        to,
        subject,
        dateSent: new Date(),
      },
    });

    return mailSent;
  }

  // static sendWelcomeEmail(user = {}, data) {
  //   const templateEmail = generateTemplateWelcomeEmail(user);
  //   this.sendEmail(templateEmail, data);
  // }
}
