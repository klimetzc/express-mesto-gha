const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const constants = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {}; // TODO

mongoose.connect('mongodb://localhost:27017/mestodb', options, (err) => {
  if (err) console.log(err);
  else console.log('database connection');
});

app.use((req, res, next) => {
  req.user = {
    _id: '62f0de8e0ec5c5dde5f19d1f',
  };

  next();
});

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res
    .status(constants.status404)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
