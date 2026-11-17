import { Router } from "express";
import {
  sendNotification,
  triggerEvent,
  getNotificationsByRecipientId,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} from "../controller/notification.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js"
import {
  validate,
  createNotificationSchema,
  getNotificationsByRecipientSchema,
  notificationIdParamSchema,
} from "../validators/index.js";

import { verifyProjectApiKey } from "../middleware/verifyProjectApiKey.middleware.js"
import { verifyOrganizationOwner } from "../middleware/authorization.middleware.js"
const router = Router();
// router.use(verifyProjectApiKey)
// Create a new notification
router.post("/", verifyProjectApiKey,sendNotification);
router.post("/triggerEvent", verifyProjectApiKey, triggerEvent)
// Get notifications by recipientId / recieptId with pagination & filters


export default router;
