import {dashboard} from "../controller/dashboard.controller.js"
import { verifyAuth } from "../middleware/auth.middleware.js"
import { verifyOrganizationOwner } from "../middleware/authorization.middleware.js"
import { Router } from "express";

const router = Router();
router.get('/:projectId',verifyAuth,dashboard)

export default router;