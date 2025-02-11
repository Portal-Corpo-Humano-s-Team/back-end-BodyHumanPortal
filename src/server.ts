import env from "./types/env";
import "dotenv/config";
import dbConnect from "./config/connectDb";
import app from "./app";
import connectRedis from "./config/connectRedis";

//Criando conexão com o servidor;

app.listen(env.PORT, () => {
  dbConnect();
  connectRedis();
  console.log("Servidor Executando");
});
