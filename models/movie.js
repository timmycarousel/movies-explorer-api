const mongoose = require("mongoose");
const validator = require("validator");

const movieSchema = new mongoose.Schema({
  country: { type: String, required: true },
  director: { type: String, required: true },
  duration: { type: Number, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "некорректная ссылка",
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "некорректная ссылка",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "некорректная ссылка",
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: Number, required: true },
  nameRU: { type: String, required: true },
  nameEN: { type: String, required: true },
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
