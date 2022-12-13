const { selectTopics, selectArticles } = require("../Models/models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) =>{
  const {sort_by} = req.query
  selectArticles(sort_by)
  .then((articles) => {
    res.status(200).send ({articles})
  })
  .catch((err) =>{
    next(err)
  })
}