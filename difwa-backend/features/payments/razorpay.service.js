import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpay = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
        throw new Error("Razorpay credentials not configured");
    }
    return new Razorpay({ key_id, key_secret });
};

export const createRazorpayOrder = async (amount, currency = "INR", notes = {}) => {
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: `receipt_${Date.now()}`,
            notes,
        };
        const order = await getRazorpay().orders.create(options);
        return order;
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        throw error;
    }
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");
    return generated_signature === signature;
};
