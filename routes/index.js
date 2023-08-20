const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { registerValidation, loginValidation } = require('../middlewares/validation');

const { register, login, logout } = require('../controllers/users');

router.post('/signup', registerValidation, register);
router.post('/signin', loginValidation, login);
router.post('/signout', logout);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует.'));
});

module.exports = router;
