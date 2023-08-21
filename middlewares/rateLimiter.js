const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимальное количество запросов
  message: 'Слишком много запросов с вашего IP, пожалуйста, повторите попытку позже.',
});

module.exports = limiter;
