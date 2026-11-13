import {    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    getUnreadNotificationsCount} from "../controller/inbox.controller.js";

import { Router } from "express";
import {verifyProjectApiKey} from "../middleware/verifyProjectApiKey.middleware.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = Router();
// router.use(verifyAuth)
router.use(verifyProjectApiKey);

router.get("/",getNotifications);
router.patch("/:notificationId/read",markNotificationAsRead);
router.delete("/:notificationId",deleteNotification);
router.get("/unread/count",getUnreadNotificationsCount);

export default router;