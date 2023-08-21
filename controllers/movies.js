const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');
const {
  invalidDataReceived,
  movieNotFound,
  deleteMoviePermissionDenied,
} = require('../constants/config');

const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(invalidDataReceived));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie
    .find({ owner: userId })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .orFail(new NotFoundError(movieNotFound))
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        // Пользователь является владельцем карточки, можно удалить
        return movie.deleteOne();
      }
      throw new ForbiddenError(deleteMoviePermissionDenied);
    })
    .then((removedMovie) => res.send(removedMovie))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(invalidDataReceived));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
