const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecretKey } = require('../utils/constants');
const { NotFoundError } = require('../utils/Errors/NotFoundError');
const { ConflictError } = require('../utils/Errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next); // Анализ ошибок в middlewares/errorHandling. Старый обработчик удалён.
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) next(new NotFoundError('Пользователь не найден'));

      res.send({ data });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((data) => {
      if (data) res.send({ data });
      else next(new NotFoundError('Такого пользователя не существует'));
    })
    .catch(next);
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const user = await User.findOne({ email }).exec();
  try {
    if (user) next(new ConflictError('Такой пользователь уже зарегистрирован'));
  } catch (err) {
    next(err);
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((data) => {
        res.send({
          user: {
            email: data.email,
            name: data.name,
            about: data.about,
            avatar: data.avatar,
          },
        });
      }))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about } },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

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
    .catch(next);
};
