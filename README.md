# Simple Forum API

This is a GraphQL API for <a href="https://github.com/silver-ts/simple-forum">Simple Forum</a>. 

## Technologies & Tools

- Node.js/Express.js
- Mongodb/Mongoose
- GraphQL
- JWT

## Features

- User registration, login and authentication with JWT.

- Option to create posts and comment in posts (if logged in).

- Option to edit and delete posts (if logged in and if your user created them).

- Option to edit and delete comments (if logged in and if your user created them).

- Queries for comments and posts along with pagination.

## Getting Started

Add your environment variables to .env (Database url, username, password, JWT secret token)

Install dependencies

```bash
npm install
```

Start the application:

```bash
npm run dev
```