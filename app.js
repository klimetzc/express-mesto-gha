const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');
const constants = require('./utils/constants');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {}; // TODO

mongoose.connect('mongodb://localhost:27017/mestodb', options, (err) => {
  if (err) console.log(err);
  else console.log('database connection');
});

app.use((req, res, next) => {
  console.log('body: ', req.body);
  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value)) throw new Error('Неверный адрес');
      return value;
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// app.use(auth);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use(errors());

app.use((req, res) => {
  res
    .status(constants.status404)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
