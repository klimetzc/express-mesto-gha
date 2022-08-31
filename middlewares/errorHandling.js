const { handleError } = require('../utils/utils');

module.exports.errorHandling = (err, req, res, next) => {
  const { statusCode, message } = handleError(err);
  res.status(statusCode).send({ message });

  next();
};
