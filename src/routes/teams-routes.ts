import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyAuthorization } from "@/middlewares/verify-authorization";

const teamsRoutes = Router();
const teamsController = new TeamsController();

teamsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamsController.create
);

teamsRoutes.get(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamsController.index
);

teamsRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamsController.update
);

teamsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamsController.remove
);

export { teamsRoutes };
