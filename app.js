const express = require("express");
const app = express();
const { getTopics, getArticles } = require("./Controllers/controllers");
const {
  handle404Paths,
  handle500Errors,
} = require("./Controllers/controllers.errors");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.all("*", handle404Paths);

app.use(handle500Errors);

module.exports = app;
