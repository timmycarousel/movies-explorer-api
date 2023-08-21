const MONGO_HOST = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const removedMovie = 'Фильм успешно удален';
const successRegistrationMessage = 'Регистрация прошла успешно.';
const registrationError = 'Ошибка при регистрации пользователя.';
const emailInUse = 'Данный email уже используется другим пользователем.';
const invalidLoginCredentials = 'Неверный email или пароль.';
const userNotFound = 'Пользователь не найден.';
const profileUpdateError = 'Ошибка при обновлении профиля.';
const userAlreadyRegistered = 'Данный email уже зарегистрирован.';
const invalidDataReceived = 'Получены некорректные данные.';
const movieNotFound = 'Фильм не найден.';
const deleteMoviePermissionDenied = 'Отказано в доступе для удаления фильма.';
const invalidAuthToken = 'Ошибка авторизации. Токен недействителен.';
const invalidTokenFormat = 'Ошибка авторизации. Токен отсутствует или имеет неправильный формат.';
const logoutSuccessMessage = 'Вы успешно вышли из системы.';

module.exports = {
  MONGO_HOST,
  removedMovie,
  successRegistrationMessage,
  registrationError,
  emailInUse,
  invalidLoginCredentials,
  userNotFound,
  profileUpdateError,
  userAlreadyRegistered,
  invalidDataReceived,
  movieNotFound,
  deleteMoviePermissionDenied,
  invalidAuthToken,
  invalidTokenFormat,
  logoutSuccessMessage,
};
