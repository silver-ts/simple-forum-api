const { GraphQLList, GraphQLID, GraphQLInt } = require("graphql");
const { UserType, PostType, CommentType } = require("./types");
const { User, Post, Comment } = require("../models");

const users = {
  type: new GraphQLList(UserType),
  description: "Get all users",
  async resolve() {
    return User.find();
  },
};

const user = {
  type: UserType,
  description: "Get a user by id",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return User.findById(args.id);
  },
};

const posts = {
  type: new GraphQLList(PostType),
  description: "Get all posts",
  args: {
    offset: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: (_, args) =>
    Post.find().sort({ createdAt: "desc" }).limit(args.limit).skip(args.offset),
};

const post = {
  type: PostType,
  description: "Get a post by id",
  args: {
    id: { type: GraphQLID },
  },
  resolve: (_, { id }) => Post.findById(id),
};

const comments = {
  type: new GraphQLList(CommentType),
  description: "Get all comments by post id",
  args: {
    postId: { type: GraphQLID },
    offset: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  resolve: (_, { postId, limit, offset }) =>
    Comment.find({ postId })
      .sort({ createdAt: "desc" })
      .limit(limit)
      .skip(offset),
};

const comment = {
  type: CommentType,
  description: "Get a comment by id",
  args: { id: { type: GraphQLID } },
  resolve: (_, { id }) => Comment.findById(id),
};

module.exports = { users, user, posts, post, comments, comment };
