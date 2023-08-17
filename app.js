require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { auth } = require('./middlewares/auth');
const {
  registerValidation,
  loginValidation,
} = require('./middlewares/validation');
const { register, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err');
const error = require('./middlewares/error');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

// Подключение к серверу MongoDB
mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => {
    console.log('Подключение к базе данных успешно');
  })
  .catch((err) => {
    console.err('Ошибка подключения к базе данных:', err);
  });

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, register);

// Регистрация маршрутов
app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

// Обработчик GET-запроса на корневой URL
app.get('/', (req, res) => {
  res.send('Привет, мир!!!!');
});

// Маршруты и логика приложения
// app.use('/', auth);
app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));
app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(3000, () => {
  console.log('Сервер подключен на порту 3000');
});
