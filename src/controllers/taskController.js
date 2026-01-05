const Task = require("../models/Task");

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, status } = req.body;

    // Validate required fields
    if (!title || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and assignedTo",
      });
    }

    // Create new task with creator from authenticated user
    const newTask = await Task.create({
      title: title.trim(),
      description: description || null,
      assignedTo: assignedTo,
      createdBy: req.user.id,
      dueDate: dueDate || null,
      status: status || "pending",
    });

    // Populate assignedTo and createdBy details
    await newTask.populate("assignedTo", "name email");
    await newTask.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
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
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Get all tasks assigned to the authenticated user
 * GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    // Find all tasks assigned to the authenticated user
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Get a single task by ID (only if assigned to or created by authenticated user)
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find task by ID first (without filters)
    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if task is assigned to or created by authenticated user
    const isAssigned = task.assignedTo._id.toString() === req.user.id;
    const isCreator = task.createdBy._id.toString() === req.user.id;

    if (!isAssigned && !isCreator) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to access this task.",
      });
    }

    res.status(200).json({
      success: true,
      task: task,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Update a task (only creator can update full task)
 * PUT /api/tasks/:id or PATCH /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, assignedTo, dueDate, status } = req.body;

    // Find task by ID first (without filters)
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if authenticated user is the creator
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the task creator can update this task.",
      });
    }

    // Update task fields if provided
    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description || null;
    }
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }
    if (status !== undefined) {
      task.status = status;
    }

    // Save updated task
    const updatedTask = await task.save();
    await updatedTask.populate("assignedTo", "name email");
    await updatedTask.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
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

    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

/**
 * Delete a task (only creator can delete task)
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find task by ID first (without filters)
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if authenticated user is the creator
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only the task creator can delete this task.",
      });
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

