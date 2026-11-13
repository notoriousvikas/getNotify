import { Router } from "express";
import {
  sendNotification,
  getNotificationsByRecipientId,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} from "../controller/notification.controller.js";
import {
  validate,
  createNotificationSchema,
  getNotificationsByRecipientSchema,
  notificationIdParamSchema,
} from "../validators/index.js";

import {verifyProjectApiKey} from "../middleware/verifyProjectApiKey.middleware.js"

const router = Router();
// router.use(verifyProjectApiKey)
// Create a new notification
router.post("/",verifyProjectApiKey,  sendNotification);

// Get notifications by recipientId / recieptId with pagination & filters


export default router;
