import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

class TaskHistoryController {
  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const task = await prisma.tasks.findFirst({ where: { id } });

      if (!task) {
        throw new AppError("task not found", 404);
      }

      const taskHistory = await prisma.taskHistory.findMany({
        where: {
          taskId: id,
        },
        include: {
          task: {
            select: {
              title: true,
            },
          },
          whoChanged: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          changedAt: "desc",
        },
      });

      return response.json(taskHistory);
    } catch (error) {
      next(error);
    }
  }
}

export { TaskHistoryController };
