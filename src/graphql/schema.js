const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLEnumType,
  GraphQLNonNull,
} = require("graphql");

/**
 * Note Type
 */
const NoteType = new GraphQLObjectType({
  name: "Note",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    owner: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

/**
 * Task Status Enum
 */
const TaskStatusType = new GraphQLEnumType({
  name: "TaskStatus",
  values: {
    pending: { value: "pending" },
    completed: { value: "completed" },
  },
});

/**
 * Task Type
 */
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: TaskStatusType },
    assignedTo: { type: GraphQLID },
    createdBy: { type: GraphQLID },
    dueDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

/**
 * Root Query Type
 */
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    getNotes: {
      type: new GraphQLList(NoteType),
      description: "Get all notes",
      resolve: async () => {
        // Resolver implementation will be added in resolvers
        return [];
      },
    },
    getTasks: {
      type: new GraphQLList(TaskType),
      description: "Get all tasks",
      resolve: async () => {
        // Resolver implementation will be added in resolvers
        return [];
      },
    },
  }),
});

/**
 * Root Mutation Type
 */
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addNote: {
      type: NoteType,
      description: "Add a new note",
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve: async (parent, args) => {
        // Resolver implementation will be added in resolvers
        return null;
      },
    },
  }),
});

/**
 * GraphQL Schema
 */
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

module.exports = schema;

