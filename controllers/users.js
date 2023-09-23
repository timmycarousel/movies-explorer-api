const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const {
  successRegistrationMessage,
  registrationError,
  emailInUse,
  invalidLoginCredentials,
  userNotFound,
  profileUpdateError,
  userAlreadyRegistered,
  logoutSuccessMessage,
} = require('../constants/config');

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
    .then(() => {
      res.status(201).send({
        email,
        name,
        message: successRegistrationMessage,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(registrationError));
      }
      if (err.code === 11000) {
        // console.log('уже есть такой e-mail');
        next(new ConflictError(emailInUse));
      } else {
        next(err);
      }
    });
};

// выход из системы
const logout = (req, res) => {
  res.clearCookie('Authorization'); // Удаление куки с JWT
  res.status(200).send({ message: logoutSuccessMessage });
};

// вход в систему
const login = (req, res, next) => {
  const { email, password } = req.body;

  let foundUser; // Объявление переменной user

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(invalidLoginCredentials);
      }

      foundUser = user; // Сохранение найденного пользователя в переменную

      return bcrypt
        .compare(password, foundUser.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            // console.log('некорректный пароль');
            throw new UnauthorizedError(invalidLoginCredentials);
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
        throw new NotFoundError(userNotFound);
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch(next);
};

// изменение данный пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(profileUpdateError));
      } else if (err.code === 11000) {
        next(new ConflictError(userAlreadyRegistered));
      } else {
        next(err);
      }
    });
};

module.exports = {
  logout,
  register,
  login,
  getUsers,
  getUserInfo,
  updateUser,
};
