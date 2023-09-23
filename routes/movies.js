const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { auth } = require('../middlewares/auth');
const {
  validateNewMovie,
  validateUSerId,
} = require('../middlewares/validation');

// Получение всех фильмов
router.get('/', auth, getMovies);

router.post('/', validateNewMovie, createMovie);
// router.post("/", createMovie);

router.delete('/:id', validateUSerId, deleteMovie);
// router.delete("/:id", deleteMovie);

module.exports = router;
