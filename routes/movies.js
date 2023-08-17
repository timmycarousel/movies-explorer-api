const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { auth } = require('../middlewares/auth');
const { validateNewMovie, validateUSerId } = require('../middlewares/validation');

router.get('/', auth, getMovies);
router.post('/', validateNewMovie, createMovie);
router.delete('/:id', validateUSerId, deleteMovie);

module.exports = router;
