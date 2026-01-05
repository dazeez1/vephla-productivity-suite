const Note = require("../models/Note");

/**
 * Create a new note
 * POST /api/notes
 */
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and content",
      });
    }

    // Create new note with owner from authenticated user
    const newNote = await Note.create({
      title: title.trim(),
      content: content,
      tags: tags || [],
      owner: req.user.id,
    });

    // Populate owner details
    await newNote.populate("owner", "name email");

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: newNote,
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

    // Handle other errors
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Get all notes owned by the authenticated user
 * GET /api/notes
 */
const getNotes = async (req, res) => {
  try {
    // Find all notes owned by the authenticated user
    const notes = await Note.find({ owner: req.user.id })
      .populate("owner", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: notes.length,
      notes: notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Get a single note by ID (only if owned by authenticated user)
 * GET /api/notes/:id
 */
const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Find note by ID first (without owner filter)
    const note = await Note.findById(noteId).populate("owner", "name email");

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to authenticated user
    if (note.owner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to access this note.",
      });
    }

    res.status(200).json({
      success: true,
      note: note,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    console.error("Get note by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Update a note (only if owned by authenticated user)
 * PUT /api/notes/:id or PATCH /api/notes/:id
 */
const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content, tags } = req.body;

    // Find note by ID first (without owner filter)
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to authenticated user
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to update this note.",
      });
    }

    // Update note fields if provided
    if (title !== undefined) {
      note.title = title.trim();
    }
    if (content !== undefined) {
      note.content = content;
    }
    if (tags !== undefined) {
      note.tags = tags;
    }

    // Save updated note
    const updatedNote = await note.save();
    await updatedNote.populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    // Handle validation errors
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

    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Delete a note (only if owned by authenticated user)
 * DELETE /api/notes/:id
 */
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Find note by ID first (without owner filter)
    const note = await Note.findById(noteId);

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if note belongs to authenticated user
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to delete this note.",
      });
    }

    // Delete the note
    await Note.findByIdAndDelete(noteId);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID format",
      });
    }

    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};

