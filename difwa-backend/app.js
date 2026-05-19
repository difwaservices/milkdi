import express from "express"
import cors from "cors"
import "./shared/config/firebase.js"
import path from "path"
import authRoutes from "./features/auth/auth.routes.js"
import adminRoutes from "./features/admin/admin.routes.js"
import uploadRoutes from "./features/upload/upload.routes.js"
import appAuthRoutes from "./features/app-auth/app-auth.routes.js";
import retailerRoutes from "./features/products/product.routes.js";
import walletRoutes from "./features/wallet/wallet.routes.js";
import subscriptionRoutes from "./features/subscriptions/subscription.routes.js";
import chatRoutes from "./features/chat/chat.routes.js";
import riderRoutes from "./features/riders/rider.routes.js";
import payoutRoutes from "./features/payments/payout.routes.js";
import communicationRoutes from "./features/communication/communication.routes.js";
import otpRoutes from "./features/app-auth/otp.routes.js";
import reviewRoutes from "./features/reviews/review.routes.js";
import orderRoutes from "./features/orders/order.routes.js";
import paymentRoutes from "./features/payments/payment.routes.js";
import cronRoutes from "./features/cron/cron.routes.js";
import favoriteRoutes from "./features/favorites/favorite.routes.js";
import notificationRoutes from "./features/notifications/notification.routes.js";
import searchRoutes from "./features/search/search.routes.js";
import commissionRoutes from "./features/commission/commission.routes.js";
import appSupportRoutes from "./features/support/app-support.routes.js";
import appNotificationRoutes from "./features/notifications/app-notification.routes.js";
import faqRoutes from "./features/faq/faq.routes.js";
import deliveryChargeRoutes from "./features/delivery/delivery-charge.routes.js";
import bannerRoutes from "./features/banners/banner.routes.js";
import Faq from "./features/faq/faq.model.js";
const app = express();

// Trust proxy for Railway/Vercel
app.set('trust proxy', 1);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowedOrigins = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/$/, ""))
            : [];
        const cleanOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.length === 0 || allowedOrigins.includes(cleanOrigin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

import connectDB from "./shared/config/db.js"
app.use(async (req, res, next) => {

    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB Connection Error:", err.message);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/retailer", retailerRoutes)
app.use("/api/otp", otpRoutes);
app.use("/api/app", appAuthRoutes);
app.use("/app", appAuthRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/wallet", walletRoutes);

app.use("/api/subscription", subscriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/payout", payoutRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/app/orders", orderRoutes);
app.use("/app/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/cron", cronRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/banners", bannerRoutes);

app.use("/api/app/favorites", favoriteRoutes);
app.use("/app/favorites", favoriteRoutes);

app.use("/api/app/search", searchRoutes);
app.use("/app/search", searchRoutes);

app.use("/api/app/support", appSupportRoutes);
app.use("/api/app/notifications", appNotificationRoutes);
app.use("/api/faq", faqRoutes);

app.use("/api/commission", commissionRoutes);
app.use("/api/delivery-charge", deliveryChargeRoutes);

// Seed Check
const seedIfEmpty = async () => {
    try {
        const count = await Faq.countDocuments();
        if (count === 0) {
            const initialFaqs = [
                { question: "How do I pause my subscription?", answer: "Go to the 'Daily' or 'Subscriptions' tab, tap on 'Pause Tomorrow' or enable 'Vacation Mode' for a range of dates.", order: 1 },
                { question: "What is the cutoff time for changes?", answer: "All changes to your subscription (pausing, resuming, or modifying) must be done before 8:00 PM for the next day's delivery.", order: 2 },
                { question: "How do I add money to my wallet?", answer: "Open 'My Wallet' from the profile or home screen, tap 'Add Money', enter the amount, and complete the payment via Razorpay.", order: 3 },
                { question: "Can I cancel an order?", answer: "Subscription orders can only be paused before they are in 'Processing' status. Once order is processing it cannot be paused.", order: 4 },
                { question: "My delivery is late, whom should I contact?", answer: "Use the 'Contact Us' form to reach admin.", order: 5 },
                { question: "Is the milk fresh and pure?", answer: "Yes, all our partner dairy farms supply 100% pure cow and buffalo milk with no preservatives, no bottles, no pouches.", order: 6 }
            ];
            await Faq.insertMany(initialFaqs);
            console.log("✅ FAQs seeded automatically");
        }
    } catch (err) { }
};
seedIfEmpty();

// Basic test route
app.get("/", (req, res) => {
    res.send("Milkdi Backend Running ")
})

// Global JSON error handler — must be last, after all routes
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

export default app