const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Define allowed file types
const allowedMimeTypes = {
  // Images
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
  // PDF
  "application/pdf": [".pdf"],
};

/**
 * File filter function to validate file types
 */
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed types: ${Object.keys(allowedMimeTypes).join(", ")}`
      ),
      false
    );
  }
};

/**
 * Storage configuration for multer
 * Stores files in uploads/ directory with unique filenames
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const uniqueFilename = `${sanitizedBaseName}-${uniqueSuffix}${fileExtension}`;
    cb(null, uniqueFilename);
  },
});

/**
 * Configured multer instance
 * - Stores files in uploads/ directory
 * - Generates unique filenames
 * - Validates file types (images and PDF only)
 * - Limits file size to 10MB
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;

