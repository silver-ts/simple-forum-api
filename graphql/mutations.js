const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post, Comment } = require("../models");
const { createJWT } = require("../util/auth");
const { PostType, CommentType, AuthenticatedUserType } = require("./types");

const register = {
  type: AuthenticatedUserType,
  description: "Register a new user and returns a token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

    if (
      (email.length || username.length || displayName.length) < 3 ||
      password.length < 6
    )
      throw new Error("One the fields is too short");
    if (
      (email.length || username.length || displayName.length) > 75 ||
      password.length > 50
    )
      throw new Error("One of the fields is too long");

    const user = new User({
      username,
      email,
      password,
      displayName,
    });

    await user.save();

    const token = createJWT({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    return { user: user, token: token };
  },
};

const login = {
  type: AuthenticatedUserType,
  description: "Login a user and return a token",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    if (args.email.length < 3 || args.password.length < 6)
      throw new Error("One of the fields is too short");
    if (args.email.length > 75 || args.password.length > 50)
      throw new Error("One of the fields is too long");

    const user = await User.findOne({ email: args.email }).select("+password");

    if (!user || args.password !== user.password)
      throw new Error("Invalid Credentials");

    const token = createJWT({
      _id: user._id,
      username: user.username,
      email: user.email,
    });

    return {
      user: user,
      token: token,
    };
  },
};

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    if (args.title.length < 4 || args.body.length < 4)
      throw new Error("One of the fields is too short");

    if (args.title.length > 300 || args.body.length > 40000)
      throw new Error("One of the fields is too long");

    const post = new Post({
      title: args.title,
      body: args.body,
      authorId: verifiedUser._id,
    });

    await post.save();

    return post;
  },
};

const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, { id, title, body }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    if (args.title.length < 4 || args.body.length < 4)
      throw new Error("One of the fields is too short");

    if (args.title.length > 300 || args.body.length > 40000)
      throw new Error("One of the fields is too long");

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, authorId: verifiedUser._id },
      { title, body },
      { new: true, runValidators: true }
    );

    return updatedPost;
  },
};

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const deletedPost = await Post.findByIdAndDelete({
      _id: postId,
      authorId: verifiedUser._id,
    });

    if (!deletedPost) throw new Error("Post not found");

    return "Post deleted";
  },
};

const addComment = {
  type: CommentType,
  description: "Add a comment to a post",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLID },
  },
  async resolve(_, { comment, postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    });

    return newComment.save();
  },
};

const updateComment = {
  type: CommentType,
  description: "Update a comment",
  args: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
  },
  async resolve(_, { id, comment }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updatedComment = await Comment.findByIdAndUpdate(
      { _id: id, userId: verifiedUser._id },
      {
        comment,
      }
    );

    if (!updatedComment) throw new Error("Comment not found");

    return updatedComment;
  },
};

const deleteComment = {
  type: GraphQLString,
  description: "Delete a comment by id",
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_, { id }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const deletedComment = await Comment.findOneAndDelete({
      _id: id,
      userId: verifiedUser._id,
    });

    if (!deletedComment) throw new Error("Comment not found");

    return "Comment deleted";
  },
};

module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
};
