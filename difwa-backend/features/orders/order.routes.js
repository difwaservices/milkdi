import express from "express";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";
import { placeOrder, getMyOrders, placeSpotOrder, getUserOrderHistory, getOrderTracking, getOrderById, getActiveOrders, getOrdersBySubscription } from "./order.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectAppUser, placeOrder);
router.post("/spot-order", protectAppUser, placeSpotOrder);
router.get("/my", protectAppUser, getUserOrderHistory); // Unified history under /my
router.get("/history", protectAppUser, getUserOrderHistory); // Also accessible via /history
router.get("/active", protectAppUser, getActiveOrders); // Active orders for app
router.get("/by-subscription/:id", protectAppUser, getOrdersBySubscription); // Orders for specific subscription
router.get("/track/:id", protectAppUser, getOrderTracking);
router.get("/:id", protectAppUser, getOrderById); // Missing route to fetch by Mongo ID or orderId

export default router;
