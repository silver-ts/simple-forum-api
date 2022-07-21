const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db/index");
const { authenticate } = require("./middlewares/auth");
var cors = require("cors");

connectDB();
const app = express();

app.use(authenticate);

app.get("/", (req, res) => {
  res.send("Welcome to my graphql api");
});

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000);
console.log("Server is running on port 3000");
