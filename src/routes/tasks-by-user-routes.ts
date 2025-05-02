import { Router } from "express";
import { TasksByUsersController } from "@/controllers/tasks-by-user.controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const tasksByUserRoutes = Router();
const tasksByUsersController = new TasksByUsersController();

tasksByUserRoutes.get(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin", "member"]),
  tasksByUsersController.index
);

tasksByUserRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin", "member"]),
  tasksByUsersController.update
);

export { tasksByUserRoutes };
