import express from "express";
import Category from "./category.model.js";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";
import { protect, retailerOnly } from "../../shared/middleware/auth.middleware.js";
import {
    getRetailerProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "./product.controller.js";
import { updateRetailerProfile } from "../auth/auth.controller.js";
import { toggleShopStatus, finalizeOrderWeight, getRetailerDashboardStats, getRetailerCustomers, addManualCustomer, createManualOrder, settleCustomerDue, getDueOrdersForCustomer, createManualSubscription, getRetailerSubscriptions, getRetailerRevenueStats, getRetailerOrders, getRetailerReviews, updateOrderItemStatus, assignRiderToOrder } from "./shop.controller.js";
import { searchAnything } from "../search/retailer-search.controller.js";
import { getDailyPrepList } from "../../shared/services/prep.service.js";
import { handleBulkOrders } from "../orders/order.controller.js";
import { getBankAccounts, addBankAccount, deleteBankAccount, setDefaultBankAccount } from "../wallet/bank.controller.js";
import { reverseGeocode } from "../../shared/services/map.service.js";
import { requestPayout, getPayoutHistory } from "../payments/payout.controller.js";

const router = express.Router();

// Bulk Order Processing
router.post("/orders/bulk-process", protect, retailerOnly, handleBulkOrders);

// Dashboard Stats
router.get("/dashboard-stats", protect, retailerOnly, getRetailerDashboardStats);
router.get("/search", protect, retailerOnly, searchAnything);

// Revenue Stats
router.get("/revenue-stats", protect, retailerOnly, getRetailerRevenueStats);

// Customers
router.get("/customers", protect, retailerOnly, getRetailerCustomers);
router.post("/customers", protect, retailerOnly, addManualCustomer);
router.post("/orders/manual", protect, retailerOnly, createManualOrder);
router.post("/customers/settle-due", protect, retailerOnly, settleCustomerDue);
router.get("/customers/:customerId/due-orders", protect, retailerOnly, getDueOrdersForCustomer);

// Orders
router.get("/orders", protect, retailerOnly, getRetailerOrders);

// Subscriptions
router.get("/subscriptions", protect, retailerOnly, getRetailerSubscriptions);
router.post("/subscriptions/manual", protect, retailerOnly, createManualSubscription);
router.patch("/order-status", protect, retailerOnly, updateOrderItemStatus);
router.post("/assign-rider", protect, retailerOnly, assignRiderToOrder);

// Payouts
router.post("/payout", protect, retailerOnly, requestPayout);
router.get("/payout/history", protect, retailerOnly, getPayoutHistory);

// Reviews
router.get("/reviews", protect, retailerOnly, getRetailerReviews);

// Bank Accounts
router.get("/banks", protect, retailerOnly, getBankAccounts);
router.post("/banks", protect, retailerOnly, addBankAccount);
router.delete("/banks/:id", protect, retailerOnly, deleteBankAccount);
router.patch("/banks/:id/default", protect, retailerOnly, setDefaultBankAccount);

// Prep List
router.get("/prep-list", protect, retailerOnly, async (req, res) => {
    try {
        const { date } = req.query;
        const requirements = await getDailyPrepList(req.user.id, date);
        res.status(200).json({ success: true, data: requirements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Reverse Geocode
router.get("/reverse-geocode", protect, retailerOnly, async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ success: false, message: "lat and lng are required" });
        const data = await reverseGeocode(lat, lng);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get all categories for retailers
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Product Management
router.get("/products", protect, retailerOnly, getRetailerProducts);
router.get("/products/:id", protect, retailerOnly, getProductById);
router.post("/products", protect, retailerOnly, createProduct);
router.put("/products/:id", protect, retailerOnly, updateProduct);
router.delete("/products/:id", protect, retailerOnly, deleteProduct);

// Shop Profile Management
router.put("/profile", protect, retailerOnly, updateRetailerProfile);
router.patch("/toggle-status", protect, retailerOnly, toggleShopStatus);
router.post("/finalize-weight", protect, retailerOnly, finalizeOrderWeight);
router.patch("/fcm-token", protect, retailerOnly, updateRetailerProfile); // Reusing profile update for simplicity or creating specific one

export default router;
