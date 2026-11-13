
import { createOrganization, updateOrganization, getOrganization, getOrganizationByUserId} from "../controller/organization.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import { verifyOrganizationMember, verifyOrganizationOwner } from "../middleware/authorization.middleware.js";


import { Router } from "express";

const router = Router();
router.use(verifyAuth);

router.post("/", createOrganization);
router.get("/user",getOrganizationByUserId)
router.get("/:organizationId",verifyOrganizationMember, getOrganization);
router.patch("/:organizationId", verifyOrganizationOwner, updateOrganization);
export default router;