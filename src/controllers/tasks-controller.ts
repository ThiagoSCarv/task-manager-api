import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Priority } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { execArgv, title } from "process";
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

      const task = await prisma.tasks.findFirst({ where: { title: title } });

      if(task) {
        throw new AppError("task already created")
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
        team_id
      });
    } catch (error) {
      next(error);
    }
  }

}

export { TasksController };
