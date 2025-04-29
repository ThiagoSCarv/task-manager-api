import express from "express";
import { errorHandling } from "./middlewares/error-handling";
import { routes } from "./routes";

const app = express();

const PORT = 3333;

app.use(express.json());

app.use(routes);

app.use(errorHandling);

export { app };
