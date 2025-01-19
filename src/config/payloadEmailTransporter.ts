import { IPayloadTransporter, ISMTP } from "../types/emailTypes";
import env from "../types/env.ts";

export const SMTP: ISMTP = {
  host: env.SMTP_HOST,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  from: "portalcorpohumano@gmail.com",
};

export const payloadTransporter: IPayloadTransporter = {
  host: SMTP.host,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP.user,
    pass: SMTP.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
