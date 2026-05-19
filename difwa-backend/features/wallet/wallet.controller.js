import * as walletService from "./wallet.service.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../payments/razorpay.service.js";
import AppUser from "../app-auth/app-user.model.js";
import User from "../auth/user.model.js";

export const createWalletOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Valid amount required" });
        }
        const order = await createRazorpayOrder(Number(amount), "INR", {
            type: "wallet_topup",
            userId: req.user.id,
        });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        // protectAppUser sets role:"customer"; protect (admin/retailer) sets role:"admin"/"retailer"
        const isAppUser = req.user.role === "appUser" || req.user.role === "customer" || !req.user.role;
        const Model = isAppUser ? AppUser : User;

        const user = await Model.findById(userId).select("walletBalance");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, balance: user.walletBalance || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTransactionHistory = async (req, res) => {
    try {
        const history = await walletService.getHistory(req.user.id);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const topUpSuccess = async (req, res) => {
    try {
        // Accept both camelCase and snake_case (Razorpay Flutter SDK returns snake_case)
        const orderId = req.body.razorpayOrderId || req.body.razorpay_order_id;
        const paymentId = req.body.razorpayPaymentId || req.body.razorpay_payment_id;
        const signature = req.body.razorpaySignature || req.body.razorpay_signature;
        const rawAmount = req.body.amount;

        if (!orderId || !paymentId || !signature || !rawAmount) {
            return res.status(400).json({ success: false, message: "Missing required payment fields" });
        }

        const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // Amount from Flutter may be in paise (Razorpay standard) — convert to rupees if > 10000
        const amountNum = Number(rawAmount);
        const amountInRupees = amountNum > 10000 ? amountNum / 100 : amountNum;

        const result = await walletService.adjustBalance(
            req.user.id,
            "appUser",
            amountInRupees,
            "Credit",
            "Wallet Top-up",
            "Razorpay",
            orderId
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
