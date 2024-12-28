import nodemailer from "nodemailer";
export const SMTP = {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER, // Seu email do Gmail
  pass: process.env.SMTP_PASS, // Substitua pela senha de aplicativo do Gmail
  from: "portalcorpohumano@gmail.com", // Email remetente
};

export const payloadTransporter = {
  host: SMTP.host,
  port: 587,
  secure: false,
  auth: {
    user: SMTP.user,
    pass: SMTP.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
