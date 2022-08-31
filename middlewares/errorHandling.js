const { handleError } = require('../utils/utils');

module.exports.errorHandling = (err, req, res, next) => {
  const { statusCode, errMessage } = handleError(err);
  res.status(statusCode).send({ message: errMessage });

  next();
};
