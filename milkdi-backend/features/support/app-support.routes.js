import express from "express";
import { contactAdmin, getSupportRequests } from "./app-support.controller.js";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";

const router = express.Router();

router.post("/contact", protectAppUser, contactAdmin);
router.get("/requests", protectAppUser, getSupportRequests);

export default router;
