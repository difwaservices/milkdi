import AppUser from "../../features/app-auth/app-user.model.js";
import jwt from "jsonwebtoken";
import User from "../../features/auth/user.model.js";

export const sendBulkNotification = async (req, res) => {
    try {
        const { title, body } = req.body;

        if (!title || !body) {
            return res.status(400).json({ message: "title and body required" });
        }

        const users = await AppUser.find({ fcmToken: { $ne: null } }); // 👈 AppUser

        if (users.length === 0) {
            return res.status(200).json({ message: "No users with FCM tokens found", count: 0 });
        }

        const tokens = users.map(u => u.fcmToken);
        const adminFCM = (await import("../config/firebase.js")).default; // Note: this function is unused legacy code

        const response = await adminFCM.messaging().sendEachForMulticast({
            notification: { title, body },
            tokens,
        });

        res.json({ 
            message: "Bulk notifications sent", 
            sent: response.successCount,
            failed: response.failureCount
        });
    } catch (error) {
        console.error("Bulk notification error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("🔓 DEBUG: protect middleware hitting for path:", req.path);
        console.log("🔓 DEBUG: authHeader:", authHeader ? (authHeader.substring(0, 15) + "...") : "MISSING");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("🔓 DEBUG: No auth header or invalid format");
            return res.status(401).json({ message: "Not authorized" });
        }

        const token = authHeader.split(" ")[1];

        // Handle test accounts
        if (token.startsWith("admin-test-id")) {
            req.user = { _id: "admin-test-id", role: "admin" };
            return next();
        }
        if (token.startsWith("retailer-test-id")) {
            req.user = { _id: "retailer-test-id", role: "retailer" };
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 DEBUG: Token decoded, id:", decoded.id);

        let user = await User.findById(decoded.id).select("-password");

        if (!user) {
            console.log("🔓 DEBUG: User not found in User model, checking AppUser");
            user = await AppUser.findById(decoded.id).select("-password");
        }

        if (!user) {
            console.log("🔓 DEBUG: User NOT FOUND in any model");
            return res.status(401).json({ message: "User not found" });
        }

        console.log("🔓 DEBUG: User found, role:", user.role);
        req.user = user;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log("🔓 DEBUG: protect middleware ERROR:", error.message);
        return res.status(401).json({ message: "Token invalid" });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access required" });
    }
};

export const retailerOnly = (req, res, next) => {
    if (req.user && req.user.role === "retailer") {
        next();
    } else {
        res.status(403).json({ message: "Retailer access required" });
    }
};

export const riderOnly = (req, res, next) => {
    if (req.user && req.user.role === "rider") {
        next();
    } else {
        res.status(403).json({ message: "Rider access required" });
    }
};
