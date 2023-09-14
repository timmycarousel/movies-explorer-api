// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://localhost:3000',
  'http://localhost:3000',
  'https://192.168.0.120:3000',
  'http://192.168.0.120:3000',
  'https://51.250.68.127:3000',
  'http://51.250.68.127:3000',
  'https://51.250.68.127',
  'http://51.250.68.127',
  'https://192.168.0.120',
  'https://192.168.0.120',
  'https://moviesexplorer.nomoredomainsicu.ru:3000',
  'http://moviesexplorer.nomoredomainsicu.ru:3000',
  'https://moviesexplorer.nomoredomainsicu.ru.sbs',
  'http://moviesexplorer.nomoredomainsicu.ru.sbs',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', true);

  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
};
