import env from "./types/env.ts";
import "dotenv/config";
import dbConnect from "./config/connectDb.ts";
import app from "./app.ts";

//Criando conexão com o servidor;

app.listen(env.PORT, () => {
  dbConnect();
  console.log("Servidor Executando");
});
