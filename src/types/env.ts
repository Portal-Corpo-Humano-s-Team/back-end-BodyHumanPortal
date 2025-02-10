import { configDotenv } from "dotenv";

configDotenv();

type EnvConfig = {
  JWT_KEY: string;
  PORT: number | string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  GOOGLE_CLIENT_ID: string;
  REDIS_URL: string;
};

const env: EnvConfig = {
  JWT_KEY: process.env.JWT_KEY || "",
  PORT: Number(process.env.PORT) || String(process.env.PORT) || 3000,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: Number(process.env.SMTP_PORT),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  REDIS_URL: process.env.REDIS_URL,
};

export default env;
