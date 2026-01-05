const Note = require("../models/Note");
const Task = require("../models/Task");

/**
 * GraphQL Resolvers
 */
const resolvers = {
  Query: {
    /**
     * Get all notes
     */
    getNotes: async () => {
      try {
        const notes = await Note.find().sort({ createdAt: -1 });
        return notes;
      } catch (error) {
        console.error("Error fetching notes:", error);
        throw new Error("Failed to fetch notes");
      }
    },

    /**
     * Get all tasks
     */
    getTasks: async () => {
      try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return tasks;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks");
      }
    },
  },

  Mutation: {
    /**
     * Add a new note
     * Note: owner field will need to be set when authentication context is added
     */
    addNote: async (parent, args) => {
      try {
        const { title, content, tags } = args;

        // Create new note
        // TODO: Set owner from authentication context when implemented
        const newNote = await Note.create({
          title: title.trim(),
          content: content,
          tags: tags || [],
          owner: null, // Will be set from auth context later
        });

        return newNote;
      } catch (error) {
        console.error("Error creating note:", error);

        // Handle validation errors
        if (error.name === "ValidationError") {
          const errorMessages = Object.values(error.errors).map(
            (err) => err.message
          );
          throw new Error(`Validation error: ${errorMessages.join(", ")}`);
        }

        throw new Error("Failed to create note");
      }
    },
  },
};

module.exports = resolvers;

