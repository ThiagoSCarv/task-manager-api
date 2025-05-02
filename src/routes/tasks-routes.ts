import { Router } from "express";
import { TasksController } from "@/controllers/tasks-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  tasksController.create
);

tasksRoutes.get(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  tasksController.index
);

tasksRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  tasksController.update
);

tasksRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  tasksController.remove
);

export { tasksRoutes };
