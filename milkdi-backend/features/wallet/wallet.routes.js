import express from "express";
import { createWalletOrder, getBalance, getTransactionHistory, topUpSuccess } from "./wallet.controller.js";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";

const router = express.Router();

router.post("/create-order", protectAppUser, createWalletOrder);
router.get("/balance", protectAppUser, getBalance);
router.get("/history", protectAppUser, getTransactionHistory);
router.post("/topup-success", protectAppUser, topUpSuccess);

export default router;
