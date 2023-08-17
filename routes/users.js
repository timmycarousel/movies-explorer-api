const router = require('express').Router();
const { getUsers, updateUser } = require('../controllers/user');
const { auth } = require('../middlewares/auth');

router.get('/me', auth, getUsers);
router.patch('/me', auth, updateUser);

module.exports = router;
