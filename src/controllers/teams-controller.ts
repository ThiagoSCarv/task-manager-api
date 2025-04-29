import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

class TeamsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(4),
        description: z.string().trim(),
      });

      const { name, description } = bodySchema.parse(request.body);

      const team = await prisma.teams.findFirst({ where: { name } });

      if (team) {
        throw new AppError("team already exists");
      }

      await prisma.teams.create({
        data: {
          name,
          description,
        },
      });

      return response.status(201).json({ name, description });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const teams = await prisma.teams.findMany();

      return response.json(teams);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const bodySchema = z.object({
        name: z.string().trim().min(4),
        description: z.string().trim(),
      });

      const { id } = paramsSchema.parse(request.params);

      const { name, description } = bodySchema.parse(request.body);

      const team = await prisma.teams.findFirst({ where: { id } });

      if (!team) {
        throw new AppError("team not found");
      }

      await prisma.teams.update({ data: { name, description }, where: { id } });

      return response.json({ name, description });
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(request.params);

      const team = await prisma.teams.findFirst({ where: { id } });

      if (!team) {
        throw new AppError("team not found");
      }

      await prisma.teams.delete({ where: { id } });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TeamsController };
