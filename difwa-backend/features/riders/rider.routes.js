import express from "express";
import {
    getRiderOrders,
    getRiderHistory,
    updateDeliveryStatus,
    updateRiderLocation,
    addRider,
    getRetailerRiders,
    updateRiderStatusByRetailer,
    respondToOrderAssignment,
    completeDelivery,
    deleteRider,
    updateRider
} from "./rider.controller.js";
import { getOptimizedRouteForRider } from "./logistics.controller.js";
import { protect, riderOnly, retailerOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Rider Side
router.get("/orders", protect, riderOnly, getRiderOrders);
router.get("/history", protect, riderOnly, getRiderHistory);
router.patch("/status", protect, riderOnly, updateDeliveryStatus);
router.patch("/order-response", protect, riderOnly, respondToOrderAssignment);
router.patch("/location", protect, riderOnly, updateRiderLocation);
router.patch("/complete", protect, riderOnly, completeDelivery);
router.get("/optimized-route", protect, riderOnly, getOptimizedRouteForRider);

// Retailer Side
router.post("/add", protect, retailerOnly, addRider);
router.get("/retailer", protect, retailerOnly, getRetailerRiders);
router.patch("/retailer/:id/status", protect, retailerOnly, updateRiderStatusByRetailer);
router.patch("/retailer/:id", protect, retailerOnly, updateRider);
router.delete("/retailer/:id", protect, retailerOnly, deleteRider);

export default router;
