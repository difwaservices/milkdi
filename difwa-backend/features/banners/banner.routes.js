import express from "express";
import { getAdminBanners, createBanner, updateBanner, deleteBanner, reorderBanners } from "./banner.controller.js";
import { getAppBanners } from "./app-banner.controller.js";
import { protect, adminOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Public App Endpoint
router.get("/app", getAppBanners);

// Admin Endpoints
router.get("/admin", protect, adminOnly, getAdminBanners);
router.post("/admin", protect, adminOnly, createBanner);
router.put("/admin/reorder", protect, adminOnly, reorderBanners);
router.put("/admin/:id", protect, adminOnly, updateBanner);
router.delete("/admin/:id", protect, adminOnly, deleteBanner);

export default router;
