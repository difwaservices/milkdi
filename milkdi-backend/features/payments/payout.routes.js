import express from "express";
import {
    requestPayout,
    getPayoutHistory,
    approvePayout,
    getAllPayouts
} from "./payout.controller.js";
import { protect, adminOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Retailer Routes
router.post("/request", protect, requestPayout);
router.get("/my-history", protect, getPayoutHistory);

// Admin Routes
router.get("/all", protect, adminOnly, getAllPayouts);
router.put("/approve/:payoutId", protect, adminOnly, approvePayout);

export default router;
