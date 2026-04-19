const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// "База данных" пользователя
let user = {
  id: 1,
  email: 'user@example.com'
};

// Настройка CSRF-защиты (используем cookies для хранения токена)
const csrfProtection = csrf({ cookie: true });

// Доп. задание: проверка Referer/Origin заголовков для дополнительной защиты
const checkOrigin = (req, res, next) => {
  // Выполняем проверку только для изменяющих запросов (POST, PUT, DELETE, и т.д.)
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowedOrigin = 'http://localhost:3000';
    
    // Проверяем совпадение источника запроса
    // Если origin есть и он не совпадает, или referer есть и он не начинается с разрешенного origin
    if ((origin && origin !== allowedOrigin) || 
        (referer && !referer.startsWith(allowedOrigin))) {
      return res.status(403).send('Доступ запрещен: неверный источник запроса (Проверка Origin/Referer провалена). Это дополнительная защита.');
    }
  }
  next();
};

// Главная страница с формой (используем middleware csrfProtection для генерации токена)
app.get('/', csrfProtection, (req, res) => {
  res.render('profile-prot', { 
    email: user.email,
    csrfToken: req.csrfToken() 
  });
});

// Защищенный обработчик смены email (добавляем проверки Origin/Referer и CSRF токена)
app.post('/update-email', checkOrigin, csrfProtection, (req, res) => {
  user.email = req.body.email;
  res.redirect('/');
});

app.listen(3000, () => console.log('Защищенный сервер запущен на http://localhost:3000'));
