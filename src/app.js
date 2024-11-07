import express from "express";
import dbConnect from "./config/dbConnect.js";
import routes from "./routes/index.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
routes(app);

const dbConnection = await dbConnect();

dbConnection.on("error", (error) => {
  console.error("erro de conexão", error);
});

dbConnection.once("open", () => {
  console.log("Conexão com o banco feita com sucesso");
});

export default app;
