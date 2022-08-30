const constants = require('./constants');

module.exports.handleError = (error) => {
  let [statusCode, message] = ['', ''];
  switch (error.name) {
    case 'BadRequest':
      statusCode = constants.status400;
      message = 'Ошибка в запросе';
      break;
    case 'UnauthorizedError':
      statusCode = constants.status401;
      message = error.message;
      break;
    case 'ConflictError':
      statusCode = constants.status409;
      message = error.message;
      break;
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
    case 'ForbiddenError':
      statusCode = constants.status403;
      message = error.message;
      break;
    default:
      statusCode = constants.status500;
      message = 'Ошибка на стороне сервера. Попробуйте позже';
      break;
  }

  return { statusCode, message };
};
