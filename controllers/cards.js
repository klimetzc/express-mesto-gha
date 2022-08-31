const Card = require('../models/card');
const { NotFoundError } = require('../utils/Errors/NotFoundError');
const { ForbiddenError } = require('../utils/Errors/ForbiddenError');
const { BadRequestError } = require('../utils/Errors/BadRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => {
      res.send({ data });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные'));
      else next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((data) => {
      if (data) res.send({ data });
      else next(new NotFoundError('Такого пользователя не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные'));
      else next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (data) res.send({ data });
      else next(new NotFoundError('Такой карточки не существует'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданые некорректные данные'));
      else next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new NotFoundError('Карточка не найдена'));
      else if (card.owner._id.toString() !== req.user._id) next(new ForbiddenError('Можно удалять только свои карточки'));
    })
    .then(() => {
      Card.findByIdAndDelete(req.params.cardId)
        .then((data) => {
          if (data) res.send({ data });
          else next(new NotFoundError('Карточка не найдена'));
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные'));
      else next(err);
    });
};
