exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "Page not found!" });
};
exports.handleCustomPaths = (err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handle400Paths = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};
exports.handleOther400Paths = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "No Body" });
  } else {
    next(err);
  }
};

exports.handleOther404Paths = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
