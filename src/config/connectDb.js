import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function dbConnect() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}
