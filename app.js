const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
} = require("./Controllers/controllers");
const {
  handle404Paths,
  handle400Paths,
  handleCustomPaths,
  handle500Errors,
} = require("./Controllers/controllers.errors");

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", handle404Paths);
app.use(handleCustomPaths);
app.use(handle400Paths);

app.use(handle500Errors);

module.exports = app;
