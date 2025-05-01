import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin", "member"]),
  tasksController.create
);

export { tasksRoutes };
