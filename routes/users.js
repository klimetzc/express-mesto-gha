const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const constants = require('../utils/constants');
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // получить всех пользователей

router.get('/me', getCurrentUser); // получить текущего пользователся

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById); // получить 1 пользователя

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo); // обновить имя & инфу юзера

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value) => {
      if (!value.match(constants.urlRegExp) || !validator.isURL(value)) throw new Error('Неверный адрес');
      return value;
    }),
  }),
}), updateUserAvatar); // обновить аватар

module.exports = router;
