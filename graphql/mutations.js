const { GraphQLString } = require("graphql");
const { User } = require("../models");

const register = {
  type: GraphQLString,
  description: "Register a new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;

    const newUser = new User({
      username,
      email,
      password,
      displayName,
    });

    const user = await newUser.save();

    console.log(user);

    return "new user created";
  },
};

module.exports = {
  register,
};
