import 'dotenv/config'
import app from "./app.js"
import connectDB from "./shared/config/db.js"
import { initCronJobs } from "./cron.js";
import { initSocket } from "./shared/services/socket.service.js";

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
            initCronJobs();
        });
        initSocket(server);
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }); // Trigger restart for new PORT
