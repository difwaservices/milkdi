import express from "express";
import { createReview, getProductReviews, submitOrderReviews } from "./review.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";

const router = express.Router();

router.post("/", protectAppUser, createReview);
router.post("/submit-order", protectAppUser, submitOrderReviews);
router.get("/:productId", getProductReviews);

export default router;
