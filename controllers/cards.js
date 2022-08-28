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
      handleError(e, res);
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
      handleError(e, res);
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
      handleError(e, res);
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card._id !== req.user._id) throw new ForbiddenError('Можео удалять только свои карточки');
  })
    .then(() => {
      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        .then((data) => {
          if (data) res.send({ data });
          else throw new NotFoundError('Такого пользователя не существует');
        })
        .catch((e) => {
          handleError(e, res);
        });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((data) => {
      if (data) res.send({ data });
      else throw new NotFoundError('Такого пользователя не существует');
    })
    .catch((e) => {
      handleError(e, res);
    });
};
