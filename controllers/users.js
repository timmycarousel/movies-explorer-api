const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
// регистрация
const register = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).send({
        token,
        email,
        name,
        message: `Пользователь ${email} успешно зарегистрирован.`,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        console.log('уже есть такой e-mail');
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

// выход из системы
const logout = (req, res) => {
  res.clearCookie('Authorization'); // Удаление куки с JWT
  res.status(200).send({ message: 'Вы успешно вышли из системы.' });
};

// вход в систему
const login = (req, res, next) => {
  const { email, password } = req.body;

  let foundUser; // Объявление переменной user

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверный логин или пароль');
      }

      foundUser = user; // Сохранение найденного пользователя в переменную

      // res.clearCookie('Authorization', { httpOnly: true });

      return bcrypt
        .compare(password, foundUser.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            console.log('некорректный пароль');
            throw new UnauthorizedError('Неверный логин или пароль');
          }

          const token = jwt.sign(
            { _id: foundUser.id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            {
              expiresIn: '7d',
            },
          );

          res.cookie('Authorization', `Bearer ${token}`, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'strict',
          });

          console.log('корректный пароль');
          console.log(`токен ${token}`);

          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

// получение всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
};

// получение данный зарегистрированного пользователя
const getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь c таким _id не найден');
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      }
    })
    .catch(next);
};


// изменение данный пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  logout, register, login, getUsers, getUserInfo, updateUser,
};
