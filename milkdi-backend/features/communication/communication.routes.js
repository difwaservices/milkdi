import express from "express";
import { sendBulkNotification, sendBulkEmail } from "./communication.controller.js";
import { protect, adminOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/notify-all", protect, adminOnly, sendBulkNotification);
router.post("/email-all", protect, adminOnly, sendBulkEmail);

export default router;
