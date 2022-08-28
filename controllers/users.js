const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError } = require('../utils/utils');
const { jwtSecretKey } = require('../utils/constants');
const { NotFoundError } = require('../utils/Errors/NotFoundError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log('function');
  User.findById(req.user._id)
    .then((data) => {
      if (!data) throw new NotFoundError('Пользователь не найден');

      res.send({ data });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((data) => {
      if (data) res.send({ data });
      else throw new NotFoundError('Такого пользователя не существует');
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((data) => {
        res.send({ data });
      })
      .catch((e) => {
        handleError(e, res);
      }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      handleError(e, res);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправльные почта или пароль'));
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) return Promise.reject(new Error('Неправильные почта или пароль'));
      res.send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => res.status(401).send({ message: err.message }));

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtSecretKey, { expiresIn: '7days' });
      res
        .cookie('jwt', token, {
          maxAge: 36000000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
