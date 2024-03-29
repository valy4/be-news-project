const {
  selectTopics,
  selectArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertComment,
  updateArticle,
  selectUsers
} = require("../Models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  selectArticles(sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  return Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticle(article_id, sort_by),
  ])
    .then((results) => {
      res.status(200).send({ comments: results[1] });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  insertComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.patchArticle = (req, res, next) => {
  const {article_id} = req.params
  const newPatch = req.body.inc_votes
  updateArticle(article_id, newPatch)
  .then((updatedArticle) => {
    res.status(200).send({article : updatedArticle})
  })
  .catch((err) => {
    next(err)
  })
}
exports.getUsers = (req, res, next) =>{
selectUsers().then((users) =>{
  res.status(200).send({users})
}

)
.catch((err) =>{
  next(err);
})
}