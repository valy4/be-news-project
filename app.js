const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getCommentsByArticle,
} = require("./Controllers/controllers");
const {
  handle404Paths,
  handle400Paths,
  handleCustomPaths,
  handle500Errors,
  handleOther400Paths
} = require("./Controllers/controllers.errors");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.all("*", handle404Paths);
app.use(handleCustomPaths);
app.use(handle400Paths);
app.use(handleOther400Paths);

app.use(handle500Errors);

module.exports = app;
