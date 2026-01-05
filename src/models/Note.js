const mongoose = require("mongoose");

/**
 * Note Schema
 * Defines the structure and validation for note documents
 */
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          // Ensure all tags are non-empty strings
          return tags.every((tag) => typeof tag === "string" && tag.trim().length > 0);
        },
        message: "Tags must be non-empty strings",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Create and export the Note model
 */
const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

