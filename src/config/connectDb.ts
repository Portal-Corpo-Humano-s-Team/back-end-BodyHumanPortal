import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient();

export default async function dbConnect(): Promise<void> {
  try {
    await prisma.$connect();
    console.log(`Conexão com o banco de dados estabelecida com sucesso`);
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Conexão com o banco de dados encerrada");
    process.exit(0);
  });
}
