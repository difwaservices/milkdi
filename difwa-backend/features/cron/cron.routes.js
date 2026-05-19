import express from "express";
import { runDailySubscriptionCron } from "./cron.controller.js";

const router = express.Router();

router.get("/generate-subscription-orders", runDailySubscriptionCron);

export default router;