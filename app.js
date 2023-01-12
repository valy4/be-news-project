const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
  postComment,
  getCommentsByArticle,
  patchArticle,
  getUsers
} = require("./Controllers/controllers");
const {
  handle404Paths,
  handle400Paths,
  handleCustomPaths,
  handle500Errors,
  handleOther404Paths,
  handleOther400Paths
} = require("./Controllers/controllers.errors");
const cors = require('cors');

app.use(express.json());
app.use(cors());


app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.patch("/api/articles/:article_id", patchArticle)
app.get("/api/users", getUsers )

app.all("*", handle404Paths);
app.use(handle400Paths);
app.use(handleOther404Paths);
app.use(handleOther400Paths)
app.use(handleCustomPaths);
app.use(handle500Errors);

module.exports = app;
