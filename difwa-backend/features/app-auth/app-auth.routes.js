import express from "express";
import protectAppUser from "../../shared/middleware/app-auth.middleware.js";

const router = express.Router();

import {
    registerUser,
    loginUser,
    googleAuth,
    getProfile,
    updateProfile,
    updateName,
    changePassword,
    forgotPassword,
    addAddress,
    updateAddress,
    getAddresses,
    deleteAddress,
    sendOtp,
    verifyOtp
} from "./app-auth.controller.js";
import { getPublicCategories } from "../admin/admin.controller.js";
import { getPublicSubscriptionPlans } from "../subscriptions/subscription.controller.js";
import { getPublicShops, getShopDetails, getShopProducts } from "../products/shop.controller.js";
import { addToCart, getCart, clearCart, updateCartItem, removeFromCart } from "../products/cart.controller.js";
// import { sendOtp, verifyOtp } from "../auth/auth.controller.js";

// Categories (Public for App)
router.get("/categories", getPublicCategories);

// Shops (Public for App)
router.get("/shops", getPublicShops);
router.get("/shops/:id", getShopDetails);
router.get("/shops/:shopId/products", getShopProducts);

// Subscription Plans (Public for App - Protected)
router.get("/subscriptions", protectAppUser, getPublicSubscriptionPlans);

//register
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// Google Auth
router.post("/google-auth", googleAuth);
router.post("/auth/google", googleAuth); // Alias


// OTP flow
router.post("/auth/send-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);

//get profile
router.get("/profile", protectAppUser, getProfile);

//update profile
router.put("/profile", protectAppUser, updateProfile);

//update name
router.put("/update-name", protectAppUser, updateName);

//change password
router.put("/change-password", protectAppUser, changePassword);

//forgot password
router.post("/forgot-password", forgotPassword);

//add address
router.post("/addaddress", protectAppUser, addAddress);
router.post("/address", protectAppUser, addAddress); // Alias for Flutter App

//get addresses
router.get("/address", protectAppUser, getAddresses);

//delete address
router.delete("/address/:id", protectAppUser, deleteAddress);

//update address
router.put("/address/:id", protectAppUser, updateAddress);
router.post("/address/update", protectAppUser, updateAddress); // For Flutter compatibility

// --- Cart ---
router.get("/cart", protectAppUser, getCart);
router.post("/cart/item", protectAppUser, addToCart);
router.post("/cart/add", protectAppUser, addToCart);       // Alias
router.put("/cart/update", protectAppUser, updateCartItem); // New
router.delete("/cart/remove/:productId", protectAppUser, removeFromCart); // New
router.delete("/cart/clear", protectAppUser, clearCart);   // Alias
router.delete("/cart", protectAppUser, clearCart);

export default router;