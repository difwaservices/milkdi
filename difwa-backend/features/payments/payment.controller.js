import crypto from "crypto";
import { createRazorpayOrder, verifyRazorpaySignature } from "./razorpay.service.js";
import Order from "../orders/order.model.js";
import AppUser from "../app-auth/app-user.model.js";

// Create Razorpay order
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await createRazorpayOrder(amount);
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify payment after mobile/web checkout (called by frontend)
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Mark the order as paid
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: "Paid",
                paymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
            });
        }

        res.status(200).json({ success: true, message: "Payment verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Razorpay webhook (called by Razorpay servers)
export const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Verify webhook signature
        const signature = req.headers["x-razorpay-signature"];
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }

        const { event, payload } = req.body;

        switch (event) {
            case "payment.captured": {
                const payment = payload.payment.entity;
                const notes = payment.notes || {};

                // Update order payment status
                if (notes.orderId) {
                    await Order.findByIdAndUpdate(notes.orderId, {
                        paymentStatus: "Paid",
                        paymentId: payment.id,
                        razorpayOrderId: payment.order_id,
                    });
                }

                // Top-up wallet if this was a wallet recharge
                if (notes.type === "wallet_topup" && notes.userId) {
                    const topupAmount = payment.amount / 100;
                    await AppUser.findByIdAndUpdate(notes.userId, {
                        $inc: { walletBalance: topupAmount },
                    });
                }
                break;
            }

            case "payment.failed": {
                const payment = payload.payment.entity;
                const notes = payment.notes || {};

                if (notes.orderId) {
                    await Order.findByIdAndUpdate(notes.orderId, {
                        paymentStatus: "Failed",
                    });
                }
                break;
            }

            case "refund.created": {
                const refund = payload.refund.entity;
                const notes = refund.notes || {};

                if (notes.orderId) {
                    await Order.findByIdAndUpdate(notes.orderId, {
                        paymentStatus: "Refunded",
                        refundId: refund.id,
                    });
                }
                break;
            }

            default:
                break;
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
