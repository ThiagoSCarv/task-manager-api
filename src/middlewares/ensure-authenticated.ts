import { AppError } from "@/utils/app-error";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/config/auth";
import { string } from "zod";

interface TokenPayload {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token invalid", 402);
  }

  const [, token] = authHeader.split(" ");

  const { sub: user_id, role } = verify(
    token,
    authConfig.jwt.secret
  ) as TokenPayload;

  request.user = {
    id: String(user_id),
    role,
  };

  return next();
}
