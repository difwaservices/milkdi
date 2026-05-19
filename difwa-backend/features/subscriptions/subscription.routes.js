import express from "express";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";
import { subscribeToProduct, getMySubscriptions, updateSubscriptionStatus, updateVacation, triggerDailyOrders } from "./subscription.controller.js";

const router = express.Router();

router.use(protectAppUser);

router.post("/subscribe", subscribeToProduct);
router.get("/my", getMySubscriptions);
router.patch("/status", updateSubscriptionStatus);
router.post("/vacation", updateVacation);
router.post("/trigger", triggerDailyOrders);

export default router;
