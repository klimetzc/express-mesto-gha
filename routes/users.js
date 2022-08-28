const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers); // получить всех пользователей
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById); // получить 1 пользователя
// router.post('/', createUser); // создать юзера
router.patch('/me', updateUserInfo); // обновить имя&инфу юзера
router.patch('/me/avatar', updateUserAvatar); // обновить аватар

module.exports = router;
