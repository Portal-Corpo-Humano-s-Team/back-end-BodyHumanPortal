import { SMTP, payloadTransporter } from "../config/payloadEmailTransporter.ts";
import { IMailParams, TDataTemplate } from "../types/emailTypes.ts";
import { ETemplateEmail } from "@prisma/client";
import nodemailer, { Transporter } from "nodemailer";
import { prisma } from "../config/connectDb.ts";
import Mustache from "mustache";
import mjml2html from "mjml";
import fs from "fs";

export const getHtmlTemplate = (type: ETemplateEmail): String => {
  const mjmlTemplate = fs.readFileSync(`./src/templates/${type.toLowerCase()}.mjml`, "utf-8");
  return mjml2html(mjmlTemplate, { filePath: `./src/templates` }).html;
};

const templates: Record<ETemplateEmail, String> = {
  [ETemplateEmail.WELCOME]: getHtmlTemplate(ETemplateEmail.WELCOME),
  [ETemplateEmail.TWOFACTORAUTH]: getHtmlTemplate(ETemplateEmail.TWOFACTORAUTH),
  [ETemplateEmail.SUPPORT]: getHtmlTemplate(ETemplateEmail.SUPPORT),
  [ETemplateEmail.OTHER]: getHtmlTemplate(ETemplateEmail.SUPPORT),
};

const templateSubject: Record<ETemplateEmail, string> = {
  [ETemplateEmail.WELCOME]: "Bem-vindo ao Portal do Corpo Humano!",
  [ETemplateEmail.TWOFACTORAUTH]: "O seu código é: {{token}}",
  [ETemplateEmail.SUPPORT]: "Suporte Portal do Corpo Humano!",
  [ETemplateEmail.OTHER]: "Other Template Portal do Corpo Humano!",
};

export default class EmailService {
  static async sendEmail({ to, userId, templateEmail }: IMailParams, params: TDataTemplate) {
    let subject = templateSubject[templateEmail as ETemplateEmail];
    subject = Mustache.render(subject, params);
    const template = templates[templateEmail as ETemplateEmail];
    const html = Mustache.render(template, params);

    const transporter: Transporter = nodemailer.createTransport(payloadTransporter);
    transporter.sendMail({ from: SMTP.from, to, subject, html });

    const data = {
      userId,
      templateEmail,
      dateSent: new Date(),
    };

    await prisma.email.create({ data });
  }
}
