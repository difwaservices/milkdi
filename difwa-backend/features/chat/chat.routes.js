import express from "express";
import { createChat, sendMessage, getMyChats } from "./chat.controller.js";
// import { protect } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/send", sendMessage);
router.get("/my", getMyChats);

export default router;
