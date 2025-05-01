import { Router } from "express";
import { TeamMembersController } from "@/controllers/team-members-controller";
import { verifyAuthorization } from "@/middlewares/verify-authorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const teamMembersRoutes = Router();
const teamMembersController = new TeamMembersController();

teamMembersRoutes.post(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamMembersController.create
);

teamMembersRoutes.get(
  "/",
  ensureAuthenticated,
  verifyAuthorization(["admin", "member"]),
  teamMembersController.index
);

teamMembersRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin"]),
  teamMembersController.remove
);

teamMembersRoutes.get(
  "/show-members-by-team/:id",
  ensureAuthenticated,
  verifyAuthorization(["admin", "member"]),
  teamMembersController.show
);

export { teamMembersRoutes };
