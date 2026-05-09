const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MONGO - Підключення
// Використовуємо змінну оточення MONGODB_URI
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qrfound';

mongoose.connect(dbURI)
  .then(() => console.log('Успішно підключено до бази даних!'))
  .catch(err => console.error('Помилка підключення до бази:', err));

// ROUTES
const routes = require('./app');
app.use('/', routes);

// Налаштування порту для Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});