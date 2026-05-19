import express from "express";
import { createOrder, verifyPayment, razorpayWebhook } from "./payment.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// Webhook must receive raw body — use express.raw() before JSON parsing
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
        // Parse raw body back to object for handler
        if (Buffer.isBuffer(req.body)) {
            req.body = JSON.parse(req.body.toString("utf8"));
        }
        next();
    },
    razorpayWebhook
);

export default router;
