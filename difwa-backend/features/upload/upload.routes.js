import express from "express";
import { upload, squareUpload } from "../../shared/middleware/s3-upload.middleware.js";
import { uploadFile } from "./upload.controller.js";

const router = express.Router();

router.post("/", ...upload.single("file"), uploadFile);
router.post("/image", ...squareUpload.single("file"), uploadFile);

export default router;
