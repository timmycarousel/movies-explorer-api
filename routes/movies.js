const router = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movie');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getMovie);
router.post('/', auth, createMovie);
router.delete('/:id', auth, deleteMovie);

module.exports = router;
