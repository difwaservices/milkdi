import express from "express"
import {
    getRetailers,
    updateRetailerStatus,
    getAppUsers,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getDashboardStats,
    getAllOrders,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    inviteAdminUser,
    changeAdminPassword,
    updateAdminProfile,
    forgotPassword,
    resetPassword,
    deleteRetailer,
    getAdminUsers,
    updateAdminUser,
    deleteAdminUser,
    getGlobalTransactions,
    getGlobalSearch,
    getAllProducts
} from "./admin.controller.js";
import { getAllSupportRequests, updateSupportEmails, getSupportEmails } from "./admin-support.controller.js";
import {
    getSubscriptionPlans,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
} from "../subscriptions/subscription.controller.js";
import { protect, adminOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router()

// Dashboard
router.get("/dashboard-stats", protect, adminOnly, getDashboardStats)

// Get all retailers (can filter by status)
router.get("/retailers", protect, adminOnly, getRetailers)

// Get all app users
router.get("/users", protect, adminOnly, getAppUsers)

// Category Management
router.get("/categories", protect, adminOnly, getCategories)
router.post("/categories", protect, adminOnly, createCategory)
router.put("/categories/:id", protect, adminOnly, updateCategory)
router.delete("/categories/:id", protect, adminOnly, deleteCategory)

// Update retailer status (approve/reject/suspend)
router.put("/retailers/status", protect, adminOnly, updateRetailerStatus)

// Subscription Management
router.get("/subscriptions", protect, adminOnly, getSubscriptionPlans)
router.post("/subscriptions", protect, adminOnly, createSubscriptionPlan)
router.put("/subscriptions/:id", protect, adminOnly, updateSubscriptionPlan)
router.delete("/subscriptions/:id", protect, adminOnly, deleteSubscriptionPlan)



// Products (all retailers)
router.get("/products", protect, adminOnly, getAllProducts)

// Order Management
router.get("/orders", protect, adminOnly, getAllOrders)

// Role Management
router.get("/roles", protect, adminOnly, getRoles)
router.post("/roles", protect, adminOnly, createRole)
router.put("/roles/:id", protect, adminOnly, updateRole)
router.delete("/roles/:id", protect, adminOnly, deleteRole)

router.post("/invite", protect, adminOnly, inviteAdminUser)

// Change Password & Profile
router.put("/change-password", protect, changeAdminPassword)
router.put("/profile", protect, updateAdminProfile)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

// Delete Retailer
router.delete("/retailers/:id", protect, adminOnly, deleteRetailer)

// Admin User Management
router.get("/admins", protect, adminOnly, getAdminUsers)
router.put("/admins/:id", protect, adminOnly, updateAdminUser)
router.delete("/admins/:id", protect, adminOnly, deleteAdminUser)

// Global Transactions
router.get("/all-transactions", protect, adminOnly, getGlobalTransactions)

// Global Search
router.get("/search", protect, adminOnly, getGlobalSearch)

// Support Requests
router.get("/support/requests", protect, adminOnly, getAllSupportRequests);
router.get("/support/emails", protect, adminOnly, getSupportEmails);
router.put("/support/emails", protect, adminOnly, updateSupportEmails);

export default router;
