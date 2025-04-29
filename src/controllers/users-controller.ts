import { Request, Response, NextFunction } from "express";
import { z } from "zod";
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
      const users = await prisma.users.findMany()

      return response.json(users)
    } catch (error) {
      next(error)
    }
  }
}

export { UsersController };
