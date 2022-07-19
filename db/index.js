const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/?retryWrites=true&w=majority`;

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB Connected");
};

module.exports = { connectDB };
