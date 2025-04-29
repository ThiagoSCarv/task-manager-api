import { Request, Response, NextFunction } from "express";
import { string, z } from "zod";
import { hash } from "bcrypt";
import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";

class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { name, email, password } = bodySchema.parse(request.body);

      const hashedPassword = await hash(password, 8);

      const userWithSameEmail = await prisma.users.findFirst({
        where: { email },
      });

      if (userWithSameEmail) {
        throw new AppError("user with same email already exists");
      }

      await prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return response.status(201).json({ name, email });
    } catch (error) {
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await prisma.users.findMany();

      return response.json(users);
    } catch (error) {
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().trim(),
      });

      const bodySchema = z.object({
        name: z.string().trim().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["admin", "member"]),
      });

      const { id } = paramsSchema.parse(request.params);

      const { name, email, password, role } = bodySchema.parse(request.body);

      const user = await prisma.users.findFirst({ where: { id } });

      if (!user) {
        throw new AppError("user not found");
      }

      const hashedPassword = await hash(password, 8);

      await prisma.users.update({
        data: { name, email, password: hashedPassword, role },
        where: { id },
      });

      return response.json();
    } catch (error) {
      next(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().trim(),
      });

      const { id } = paramsSchema.parse(request.params);

      const user = await prisma.users.findFirst({ where: { id } });

      if (!user) {
        throw new AppError("user not found");
      }

      await prisma.users.delete({ where: { id } });

      return response.json();
    } catch (error) {
      next(error);
    }
  }
}

export { UsersController };
