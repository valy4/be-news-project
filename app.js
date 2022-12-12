const express = require("express");
const app = express();
const { getTopics } = require("./Controllers/controllers");
const {
  handle404Paths,
  handle500Errors,
} = require("./Controllers/controllers.errors");
app.use(express.json());

app.get("/api/topics", getTopics);
app.all("*", handle404Paths);
app.use(handle500Errors);

module.exports = app;
