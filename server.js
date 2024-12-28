import "dotenv/config";
import dbConnect from "./src/config/connectDb.js";
import app from "./src/app.js";

//Criando conexão com o servidor;

app.listen(process.env.PORT, () => {
  dbConnect();
  console.log("Servidor Executando");
});
