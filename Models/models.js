const db = require("../db/connection");

exports.selectTopics = () => {
  const SQL = "SELECT * FROM topics";
  return db.query(SQL).then((result) => {
    return result.rows;
  });
};

exports.selectArticles = (sort_by = "created_at") => {
  const SQL = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(articles.article_id) AS comment_count 
  FROM articles
  JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
  ORDER BY ${sort_by} DESC`;

  return db.query(SQL).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  const SQL = "SELECT * FROM articles WHERE article_id = $1";

  return db.query(SQL, [article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ msg: "Page not found!", status: 404 });
    } else {
      return result.rows[0];
    }
  });
};
exports.selectCommentsByArticle = (article_id) => {
  const SQL = `SELECT comment_id, votes, created_at, author, body FROM comments
  WHERE  article_id = $1`;
  return db.query(SQL, [article_id]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ msg: "Page not found!", status: 404 });
    } else {
      return result.rows;
    }
  });
};
