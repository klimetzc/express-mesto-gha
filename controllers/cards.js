const Card = require('../models/card');
const { handleError } = require('../utils/utils');
const { NotFoundError } = require('../utils/Errors/NotFoundError');
const { ForbiddenError } = require('../utils/Errors/ForbiddenError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      const { statusCode, message } = handleError(e);
      res.status(statusCode).send({ message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => {
      res.send({ data });
    })
    .catch((e) => {
      const { statusCode, message } = handleError(e);
      res.status(statusCode).send({ message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((data) => {
      if (data) res.send({ data });
      else throw new NotFoundError('Такого пользователя не существует');
    })
    .catch((e) => {
      const { statusCode, message } = handleError(e);
      res.status(statusCode).send({ message });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (data) res.send({ data });
      else throw new NotFoundError('Такой карточки не существует');
    })
    .catch((e) => {
      const { statusCode, message } = handleError(e);
      res.status(statusCode).send({ message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) return Promise.reject(new NotFoundError('Карточка не найдена'));
      if (card.owner._id.toString() !== req.user._id) return Promise.reject(new ForbiddenError('Можно удалять только свои карточки'));
    })
    .then(() => {
      Card.findByIdAndDelete(req.params.cardId)
        .then((data) => {
          if (data) res.send({ data });
          else throw new NotFoundError('Такого пользователя не существует');
        })
        .catch((e) => {
          const { statusCode, message } = handleError(e);
          res.status(statusCode).send({ message });
        });
    })
    .catch((e) => {
      const { statusCode, message } = handleError(e);
      res.status(statusCode).send({ message });
    });
};
