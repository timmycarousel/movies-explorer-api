const router = require('express').Router();
const { getUserInfo, getUsers, updateUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { validateUpdateUser } = require('../middlewares/validation');

// GET /users — возвращает всех пользователей
router.get('/', auth, getUsers);

// GET /users/me — возвращает пользователя
router.get('/me', auth, getUserInfo);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
