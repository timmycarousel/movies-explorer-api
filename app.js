require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_HOST } = require('./constants/config');

const error = require('./middlewares/error');

const app = express();

// Подключение к серверу MongoDB
mongoose.connect(MONGO_HOST);

app.use(requestLogger);

app.use(limiter);

// Маршруты и логика приложения

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(errors());
app.use(router);
app.use(requestLogger);
app.use(errorLogger);
app.use(error);

app.listen(3010, () => {
  console.log('Сервер запущен на порту 3010');
});
