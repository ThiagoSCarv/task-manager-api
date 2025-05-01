import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "@/utils/app-error";
import { prisma } from "@/config/prisma";

class TeamMembersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        user_id: z.string().uuid({ message: "uuid not valid" }),
        team_id: z.string().uuid({ message: "uuid not valid" }),
      });

      const { user_id, team_id } = bodySchema.parse(request.body);

      const user = await prisma.users.findFirst({ where: { id: user_id } });

      const team = await prisma.teams.findFirst({ where: { id: team_id } });

      if (!user) {
        throw new AppError("user not found");
      }

      if (!team) {
        throw new AppError("team not found");
      }

      const userAlreadyInTeam = await prisma.teamMembers.findFirst({
        where: {
          userId: user_id,
          teamId: team_id,
        },
      });

      if (userAlreadyInTeam) {
        throw new AppError("user already in this team");
      }

      await prisma.teamMembers.create({
        data: {
          userId: user_id,
          teamId: team_id,
        },
      });

      return response.status(201).json({ user_id, team_id });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const teamsAndMembers = await prisma.teamMembers.findMany({
        include: {
          team: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      });

      return response.json(teamsAndMembers);
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

      const teamMember = await prisma.teamMembers.findFirst({ where: { id } });

      if (!teamMember) {
        throw new AppError("member of team not found");
      }

      await prisma.teamMembers.delete({ where: { id } });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { TeamMembersController };
