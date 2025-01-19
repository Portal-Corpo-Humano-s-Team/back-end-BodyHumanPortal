import express, { Express } from "express";
import routes from "./routes/index.js";
import cors from "cors";

const app: Express = express();
app.use(cors());
app.use(express.json());
routes(app);

export default app;
