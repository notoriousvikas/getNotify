import { Router } from "express";
import { createApiKey, getApiKeys } from "../controller/apikey.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import { verifyOrganizationMember, verifyOrganizationOwner } from "../middleware/authorization.middleware.js";
// import { validate, createApiKeySchema } from "../validators/index.js";

const router = Router();

router.use(verifyAuth);
router.get(
  "/project/:projectId",

  getApiKeys
);
router.post("/", verifyOrganizationOwner, createApiKey);

export default router;
