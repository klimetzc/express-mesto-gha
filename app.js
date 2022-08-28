const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const constants = require('./utils/constants');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const options = {}; // TODO

mongoose.connect('mongodb://localhost:27017/mestodb', options, (err) => {
  if (err) console.log(err);
  else console.log('database connection');
});

app.post('/signin', login);
app.post('/signup', createUser);

// app.use(auth);

app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use((req, res) => {
  res
    .status(constants.status404)
    .send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
