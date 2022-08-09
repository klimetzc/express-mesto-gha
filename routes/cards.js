const router = require('express').Router();

const {
  getCards,
  deleteLike,
  createCard,
  likeCard,
  deleteCard,
} = require('../controllers/cards');

router.get('/', getCards); // получить все карты
router.post('/', createCard); // создать карту
router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', deleteLike); // убрать лайк
router.delete('/:cardId', deleteCard); // удалить карточку

module.exports = router;
