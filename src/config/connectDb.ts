import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient();

export default async function dbConnect(): Promise<void> {
  try {
    await prisma.$connect();
    console.log(`Conexão com o Prisma estabelecida com sucesso`);
  } catch (error) {
    console.error("Erro ao conectar ao Prisma:", error);
  }

  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Conexão com o Prisma encerrada");
    process.exit(0);
  });
}
