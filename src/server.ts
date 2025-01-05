import "dotenv/config";
import dbConnect from "./config/connectDb.js";
import app from "./app.js";

//Criando conexão com o servidor;

app.listen(process.env.PORT, () => {
  dbConnect();
  console.log("Servidor Executando 123");
});
