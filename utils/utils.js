const constants = require('./constants');

module.exports.handleError = (error, response) => {
  let [statusCode, message] = ['', ''];
  switch (error.name) {
    case 'CastError':
      statusCode = constants.status400;
      message = 'Неверный запрос.';
      break;
    case 'ValidationError':
      statusCode = constants.status400;
      message = 'Неверный запрос.';
      break;
    case 'NotFoundError':
      statusCode = constants.status404;
      message = error.message;
      break;
    default:
      statusCode = constants.status500;
      message = 'Ошибка на стороне сервера. Попробуйте позже';
      break;
  }
  response.status(statusCode).send({ message });
};

class NotFoundError {
  constructor(message) {
    this.message = message;
    this.name = 'NotFoundError';
  }
}
module.exports.NotFoundError = NotFoundError;
