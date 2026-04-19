const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// "База данных" пользователя
let user = {
  id: 1,
  email: 'user@example.com'
};

// Главная страница с формой
app.get('/', (req, res) => {
  res.render('profile-vuln', { email: user.email });
});

// Уязвимый обработчик смены email (нет CSRF-защиты)
app.post('/update-email', (req, res) => {
  user.email = req.body.email;
  res.redirect('/');
});

app.listen(3000, () => console.log('Уязвимый сервер запущен на http://localhost:3000'));
