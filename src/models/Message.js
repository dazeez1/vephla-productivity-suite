const mongoose = require("mongoose");

/**
 * Message Schema
 * Defines the structure and validation for chat message documents
 */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
    room: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Create and export the Message model
 */
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

