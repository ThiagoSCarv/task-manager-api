import express from "express";
import { errorHandling } from "./middlewares/error-handling";
const app = express();

const PORT = 3333;

app.use(express.json());

app.use(errorHandling);

export { app };
