export const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.status(200).json({
            url: req.file.location,
            filename: req.file.originalname,
        });
    } catch (error) {
        console.error("S3 upload error:", error);
        res.status(500).json({ message: error.message });
    }
};
