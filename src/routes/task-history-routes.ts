import { Router } from "express";
import { TaskHistoryController } from "@/controllers/task-history-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const taskHistoryRouter = Router();
const taskHistoryController = new TaskHistoryController();

taskHistoryRouter.get(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  taskHistoryController.show
);

export { taskHistoryRouter };
