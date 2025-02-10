import { createClient } from "redis";
import env from "../types/env.ts";
export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    tls: true,
  },
});

redisClient.on("error", (err) => console.error("Erro ao conectar ao Redis:", err));

export default async function connectRedis(): Promise<void> {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Conexão com Redis estabelecida com sucesso.");
    }
  } catch (err) {
    console.error("Erro ao conectar ao Redis:", err);
  }

  process.on("SIGINT", async () => {
    await redisClient.disconnect();
    console.log("Conexão com o Redis encerrada");
    process.exit(0);
  });
}
