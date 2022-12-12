exports.handle404Paths = (req, res, next) => {
  res.status(404).send({ msg: "Page not found!" });
};

exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
