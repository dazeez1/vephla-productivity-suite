const mongoose = require("mongoose");

/**
 * File Schema
 * Defines the structure and validation for file documents
 */
const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Create and export the File model
 */
const File = mongoose.model("File", fileSchema);

module.exports = File;

