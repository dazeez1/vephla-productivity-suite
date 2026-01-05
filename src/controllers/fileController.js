const File = require("../models/File");

/**
 * Upload a file
 * POST /api/files
 * Note: Requires multer middleware to be applied to the route
 */
const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Extract file information from multer
    const uploadedFile = req.file;
    const filename = uploadedFile.filename;
    const fileType = uploadedFile.mimetype;
    const originalName = uploadedFile.originalname;

    // Construct file URL (relative path)
    // In production, this would be a full URL to your file server/CDN
    const fileUrl = `/uploads/${filename}`;

    // Save file metadata to database
    const fileRecord = await File.create({
      filename: filename,
      fileType: fileType,
      url: fileUrl,
      uploadedBy: req.user.id,
    });

    // Populate uploadedBy details
    await fileRecord.populate("uploadedBy", "name email");

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      file: {
        id: fileRecord._id,
        filename: fileRecord.filename,
        originalName: originalName,
        fileType: fileRecord.fileType,
        url: fileRecord.url,
        uploadedBy: fileRecord.uploadedBy,
        createdAt: fileRecord.createdAt,
        updatedAt: fileRecord.updatedAt,
      },
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessages,
      });
    }

    // Handle multer errors
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB",
      });
    }

    if (error.message && error.message.includes("Invalid file type")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Handle other errors
    console.error("Upload file error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Get all files uploaded by the authenticated user
 * GET /api/files
 */
const getFiles = async (req, res) => {
  try {
    // Find all files uploaded by the authenticated user
    const files = await File.find({ uploadedBy: req.user.id })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: files.length,
      files: files,
    });
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};

