import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.get(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  usersController.index
);
usersRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  usersController.update
);
usersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  usersController.delete
);

export { usersRoutes };
