const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// STATIC
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MONGO
// Шукаємо змінну від Render, якщо її немає — беремо локальну базу
const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qrfound';

mongoose.connect(dbURI)
  .then(() => console.log('✅ Підключено до хмарної бази MongoDB!'))
  .catch(err => console.error('❌ Помилка підключення:', err));

// ROUTES
const routes = require('./app');

app.use('/', routes);

const PORT = 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});