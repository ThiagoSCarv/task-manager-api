import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Priority } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { execArgv, title } from "process";
import { REPLCommand } from "repl";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        assigned_to: z.string().uuid({ message: "uuid not valid" }),
        team_id: z.string().uuid({ message: "uuid not valid" }),
      });

      const { title, description, priority, assigned_to, team_id } =
        bodySchema.parse(request.body);

      const userInTeam = await prisma.teamMembers.findFirst({
        where: {
          userId: assigned_to,
          teamId: team_id,
        },
      });

      if (!userInTeam) {
        throw new AppError("user not member of this team");
      }

      const task = await prisma.tasks.findFirst({
        where: {
          title: title,
          teamId: team_id,
        },
      });

      if (task) {
        throw new AppError("task already created");
      }

      await prisma.tasks.create({
        data: {
          title,
          description,
          priority,
          assignedTo: assigned_to,
          teamId: team_id,
        },
      });

      return response.status(201).json({
        title,
        description,
        priority,
        assigned_to,
        team_id,
      });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const tasks = await prisma.tasks.findMany({
        include: {
          teamTask: {
            select: {
              name: true,
            },
          },
          userAssigned: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return response.json(tasks);
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

      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        status: z.enum(["pending", "in_progress", "completed"]),
        assigned_to: z.string().uuid({ message: "uuid not valid" }),
        team_id: z.string().uuid({ message: "uuid not valid" }),
      });

      const { title, description, priority, status, assigned_to, team_id } =
        bodySchema.parse(request.body);

      const task = await prisma.tasks.findFirst({
        where: {
          id: id,
        },
      });

      if (!task) {
        throw new AppError("task not found");
      }

      if (task.status === "completed") {
        throw new AppError("task already completed");
      }

      await prisma.tasks.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          priority,
          status,
          assignedTo: assigned_to,
          teamId: team_id,
        },
      });

      return response.json({
        title,
        description,
        priority,
        status,
        assigned_to,
        team_id,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "uuid not valid" }),
      });

      const { id } = paramsSchema.parse(request.params);

      const task = await prisma.tasks.findFirst({ where: { id: id } });

      if (!task) {
        throw new AppError("task not found");
      }

      await prisma.tasks.delete({ where: { id: id } });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TasksController };
