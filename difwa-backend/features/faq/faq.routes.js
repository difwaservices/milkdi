import express from "express";
import { 
    getFaqs, 
    createFaq, 
    updateFaq, 
    deleteFaq, 
    seedFaqs 
} from "./faq.controller.js";
import { protect, adminOnly } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getFaqs);
router.post("/seed", seedFaqs);

// Admin only routes
router.post("/", protect, adminOnly, createFaq);
router.put("/:id", protect, adminOnly, updateFaq);
router.delete("/:id", protect, adminOnly, deleteFaq);

export default router;
