const jsonwebtoken = require('jsonwebtoken');
const { jwtSecretKey } = require('../utils/constants');
const { UnauthorizedError } = require('../utils/Errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(new UnauthorizedError('Необходима авторищация'));
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, jwtSecretKey);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторищация'));
  }

  req.user = payload;

  next();
};
