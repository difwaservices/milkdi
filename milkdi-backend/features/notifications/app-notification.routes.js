import express from "express";
import { getMyNotifications, markAsRead, deleteNotification } from "./app-notification.controller.js";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";

const router = express.Router();

router.get("/", protectAppUser, getMyNotifications);
router.put("/:id/read", protectAppUser, markAsRead);
router.delete("/:id", protectAppUser, deleteNotification);

export default router;
