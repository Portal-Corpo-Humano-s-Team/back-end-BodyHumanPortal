import { ETemplateEmail } from "@prisma/client";

export interface IPayloadTransporter {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

export interface ISMTP {
  host: string;
  user: string;
  pass: string;
  from: string;
}

export interface IMailParams {
  to: string;
  userId: string;
  templateEmail: ETemplateEmail;
}

export interface IBaseTemplateData {
  name: string;
}

interface ITwoFactorTemplateData extends IBaseTemplateData {
  token: string;
}
interface IWelcomeTemplateData extends IBaseTemplateData {}
interface IOtherTemplateData extends IBaseTemplateData {}
interface ISupportTemplateData extends IBaseTemplateData {
  message: string;
}

export type TDataTemplate = IWelcomeTemplateData | ITwoFactorTemplateData | ISupportTemplateData | IOtherTemplateData;
