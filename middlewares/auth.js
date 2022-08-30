const jsonwebtoken = require('jsonwebtoken');
const { jwtSecretKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, jwtSecretKey);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
