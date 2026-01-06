import { NextFunction, Request, Response } from "express";
import { knex } from "../knex";
import { randomUUID } from "node:crypto";

export default class TaskController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const allTasks = await knex("task").select("*");
      res.status(200).json(allTasks);
    } catch (error) {
      next(error);
    }
  }

  async indexById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const task = await knex("task").where({ id }).first();

      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, completed } = req.body;

      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Título inválido" });
      }

      if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed deve ser boolean" });
      }

      const newTask = {
        id: randomUUID(),
        title,
        description: description ?? null,
        completed: completed ?? false,
      };

      await knex("task").insert(newTask);

      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      if (title !== undefined && (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({ message: "Título inválido" });
      }

      if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed deve ser boolean" });
      }

      const updatedTask: Record<string, any> = {};

      if (title !== undefined) updatedTask.title = title;
      if (description !== undefined) updatedTask.description = description;
      if (completed !== undefined) updatedTask.completed = completed;

      if (Object.keys(updatedTask).length === 0) {
        return res.status(400).json({ message: "Nenhum campo para atualizar" });
      }

      const updated = await knex("task").where({ id }).update(updatedTask);

      if (updated === 0) {
        return res.status(404).json({ message: "Task não encontrada" });
      }

      const task = await knex("task").where({ id }).first();
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deleted = await knex("task").where({ id }).del();

      if (deleted === 0) {
        return res.status(404).json({ message: "Task não encontrada" });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
