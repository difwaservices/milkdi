import express from "express";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";
import { toggleFavorite, getFavorites } from "./favorite.controller.js";

const router = express.Router();

router.post("/", protectAppUser, toggleFavorite);
router.get("/", protectAppUser, getFavorites);

export default router;
