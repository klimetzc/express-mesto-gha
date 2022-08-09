module.exports.handleError = (error, response) => {
  let [statusCode, message] = ['', ''];
  switch (error.name) {
    case 'CastError':
      statusCode = 400;
      message = 'Неверный запрос.';
      break;
    case 'ValidationError':
      statusCode = 400;
      message = 'Неверный запрос.';
      break;
    case 'NotFoundError':
      statusCode = 404;
      message = error.message;
      break;
    default:
      statusCode = 500;
      message = 'Ошибка на стороне сервера. Попробуйте позже';
      break;
  }
  response.status(statusCode).send({ message: [error.name, error.message] });
};

class NotFoundError {
  constructor(message) {
    this.message = message;
    this.name = 'NotFoundError';
  }
}
module.exports.NotFoundError = NotFoundError;
