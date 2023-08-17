const router = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movie');
const { auth } = require('../middlewares/auth');
const { validateNewMovie, validateUSerId } = require('../middlewares/validation');

router.get('/', auth, getMovie);
router.post('/', validateNewMovie, createMovie);
router.delete('/:id', validateUSerId, deleteMovie);

module.exports = router;
