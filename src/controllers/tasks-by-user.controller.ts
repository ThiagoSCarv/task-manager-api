import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

class TasksByUsersController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const user_id = request.user?.id;

      const tasksByUser = await prisma.tasks.findMany({
        where: {
          assignedTo: user_id,
        },
      });

      if (!tasksByUser) {
        throw new AppError("there are no tasks related to this user", 404);
      }

      return response.json(tasksByUser);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "uuid not valid" }),
      });

      const { id } = paramsSchema.parse(request.params);

      const user_id = String(request.user?.id);

      const bodySchema = z.object({
        status: z.enum(["pending", "in_progress", "completed"]),
      });

      const { status } = bodySchema.parse(request.body);

      const task = await prisma.tasks.findFirst({
        where: {
          id: id,
          assignedTo: user_id,
        },
      });

      const old_status = task?.status;

      if (!task) {
        throw new AppError("task not found or not assigned to this user", 404);
      }

      if (task.status === "completed") {
        throw new AppError("task already completed");
      }

      await prisma.tasks.update({
        where: {
          id: id,
          assignedTo: user_id,
        },
        data: {
          status,
        },
      });

      await prisma.taskHistory.create({
        data: {
          taskId: id,
          changedBy: user_id,
          oldStatus: old_status,
          newStatus: status,
        },
      });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TasksByUsersController };
