import { Router } from "express";
import {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  setDefaultProvider,
  deleteProvider,
} from "../controller/provider.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import {
  verifyOrganizationMember,
  verifyOrganizationOwner,
} from "../middleware/authorization.middleware.js";
import {
  validate,
  createProviderSchema,
  updateProviderSchema,
  providerIdParamSchema,
} from "../validators/index.js";

const router = Router();

// authentication for all provider routes
router.use(verifyAuth);

// Read routes: Accessible to organization members/owners
router.get("/", getProviders);
router.get(
  "/:id",
  validate(providerIdParamSchema, "params"),
  getProviderById
);

// Creation: Only organization owner can add providers
router.post(
  "/",
  validate(createProviderSchema),
  verifyOrganizationOwner,
  createProvider
);

// Update: Only organization owner can update providers
router.patch(
  "/:id",
  validate(providerIdParamSchema, "params"),
  validate(updateProviderSchema),
  verifyOrganizationOwner,
  updateProvider
);

// Set default: Only organization owner can change default provider
router.patch(
  "/:id/set-default",
  validate(providerIdParamSchema, "params"),
  verifyOrganizationOwner,
  setDefaultProvider
);

// Delete: Only organization owner can delete providers
router.delete(
  "/:id",
  validate(providerIdParamSchema, "params"),
  verifyOrganizationOwner,
  deleteProvider
);

export default router;
