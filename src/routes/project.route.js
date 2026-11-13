import { Router } from "express";
import {
  createProject,
  updateProject,
  getProjectsByOrganization,
  getProjectById,
  deleteProject,
} from "../controller/project.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import { verifyOrganizationOwner } from "../middleware/authorization.middleware.js";
import {
  validate,
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
  organizationIdParamSchema,
} from "../validators/index.js";

const router = Router();

// Protect all project routes
router.use(verifyAuth);
// router.use(verifyOrganizationOwner)
router.post("/", validate(createProjectSchema), createProject);
router.get(
  "/organization/:organizationId",
  validate(organizationIdParamSchema, "params"),
  getProjectsByOrganization
);
router.get("/:projectId", validate(projectIdParamSchema, "params"), getProjectById);
router.patch("/:projectId", validate(updateProjectSchema), updateProject);
router.delete("/:projectId", validate(projectIdParamSchema, "params"), deleteProject);

export default router;
