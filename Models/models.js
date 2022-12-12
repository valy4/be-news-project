const db = require("../db/connection");

exports.selectTopics = () => {
  const SQL = "SELECT * FROM topics";
  return db.query(SQL).then((result) => {
    return result.rows;
  });
};
