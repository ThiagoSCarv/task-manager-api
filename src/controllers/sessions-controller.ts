import { prisma } from "@/config/prisma";
import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/config/auth";

class SessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { email, password } = bodySchema.parse(request.body);

      const user = await prisma.users.findFirst({ where: { email } });

      if (!user) {
        throw new AppError("invalid email or password", 402);
      }

      const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        throw new AppError("invalid email or password", 402);
      }

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({ role: user.role }, secret, {
        expiresIn,
        subject: String(user.id),
      });

      const { password: hashedPassword, ...userWithoutPassword } = user;

      return response.json({ token, user: userWithoutPassword });
    } catch (error) {
      next(error);
    }
  }
}

export { SessionsController };
