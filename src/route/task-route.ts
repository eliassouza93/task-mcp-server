import Route from "express";
import TaskController from "../controller/task-controller";

export const route = Route();
const taskController = new TaskController();
route.get("/", taskController.index);
route.get("/:id", taskController.indexById);
route.post("/", taskController.create);
route.put("/:id", taskController.update);
route.delete("/:id", taskController.delete);
