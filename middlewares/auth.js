const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Подключение пакета cors
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const app = express();

app.use(cookieParser());
app.use(cors);

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies && req.cookies.Authorization
    ? req.cookies.Authorization.replace('Bearer ', '')
    : null;

  if (!token) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnauthorizedError('Неверный токен авторизации'));
  }

  req.user = payload;

  next();
};

module.exports = { auth };
