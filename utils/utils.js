module.exports.handleError = (error, response) => {
  let [statusCode, message] = ['', ''];
  switch (error.name) {
    case 'CastError':
      statusCode = 404;
      message = 'Такой страницы не существует.';
      break;
    case 'ValidationError':
      statusCode = 400;
      message = 'Неверный запрос.';
      break;
    default:
      statusCode = 500;
      message = 'Ошибка на стороне сервера. Попробуйте позже';
      break;
  }
  response.status(statusCode).send({ message });
};
