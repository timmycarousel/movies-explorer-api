const router = require('express').Router();
const { getUserInfo, getUsers, updateUser } = require('../controllers/user');
const { auth } = require('../middlewares/auth');
const { validateUpdateUser } = require('../middlewares/validation');

router.get('/me', auth, getUsers);
router.get('/me', auth, getUserInfo);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
