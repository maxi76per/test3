const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


let user = {
  id: 1,
  email: 'user@example.com'
};


const csrfProtection = csrf({ cookie: true });


const checkOrigin = (req, res, next) => {
 
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowedOrigin = 'http://localhost:3000';
    
    
    
    if ((origin && origin !== allowedOrigin) || 
        (referer && !referer.startsWith(allowedOrigin))) {
      return res.status(403).send('Доступ запрещен: неверный источник запроса (Проверка Origin/Referer провалена). Это дополнительная защита.');
    }
  }
  next();
};


app.get('/', csrfProtection, (req, res) => {
  res.render('profile-prot', { 
    email: user.email,
    csrfToken: req.csrfToken() 
  });
});


app.post('/update-email', checkOrigin, csrfProtection, (req, res) => {
  user.email = req.body.email;
  res.redirect('/');
});

app.listen(3000, () => console.log('Защищенный сервер запущен на http://localhost:3000'));
