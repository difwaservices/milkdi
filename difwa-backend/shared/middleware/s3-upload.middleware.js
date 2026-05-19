import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";
import s3 from "../config/s3.js"; // shared/config/s3.js - no path change needed (same shared folder)

const BUCKET = process.env.AWS_S3_BUCKET;
const REGION = process.env.AWS_REGION;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const memoryUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, ALLOWED_TYPES.includes(file.mimetype));
    },
});

const pushToS3 = async (file, folder, transform) => {
    let buffer = file.buffer;
    let contentType = file.mimetype;

    if (transform && file.mimetype.startsWith("image/")) {
        buffer = await sharp(file.buffer)
            .resize(transform.width, transform.height, { fit: transform.fit || "cover" })
            .toFormat("webp")
            .toBuffer();
        contentType = "image/webp";
    }

    const ext = transform ? ".webp" : path.extname(file.originalname) || "";
    const key = `${folder}/${randomUUID()}${ext}`;

    if (!BUCKET || !REGION) {
        throw new Error("AWS_S3_BUCKET or AWS_REGION env variable is not set");
    }

    await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    }));

    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
};

const s3Middleware = (fieldName, folder, transform) => [
    memoryUpload.single(fieldName),
    async (req, res, next) => {
        if (!req.file) return next();
        try {
            req.file.location = await pushToS3(req.file, folder, transform);
            next();
        } catch (err) {
            next(err);
        }
    },
];

// General upload (all allowed types)
export const upload = {
    single: (field) => s3Middleware(field, "milkdi", null),
};

// Square 1024x1024 product images
export const squareUpload = {
    single: (field) => s3Middleware(field, "milkdi/products", { width: 1024, height: 1024, fit: "cover" }),
};

export default upload;
