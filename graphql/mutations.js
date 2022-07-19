const { GraphQLString } = require("graphql");
const { User } = require("../models");
const { createJWT } = require("../util/auth");

const register = {
  type: GraphQLString,
  description: "Register a new user and returns a token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

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

    return token;
  },
};

module.exports = {
  register,
};
