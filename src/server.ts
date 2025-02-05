import env from "./types/env.ts";
import "dotenv/config";
import dbConnect from "./config/connectDb.ts";
import app from "./app.ts";
import connectRedis from "./config/connectRedis.ts";

//Criando conexão com o servidor;

app.listen(env.PORT, () => {
  dbConnect();
  connectRedis();
  console.log("Servidor Executando");
});
