import "dotenv/config";
import app from "./src/app.js";

//Criando conexão com o servidor;

app.listen(process.env.PORT, () => {
  console.log("Servidor Executando");
});
