import express, { json } from "express";
import { route } from "./route/task-route";

const app = express();
app.use(json());
app.use(route);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: "Erro interno" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
