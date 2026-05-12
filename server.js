const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC
========================= */

app.use(express.static(
    path.join(__dirname, 'public')
));

/* =========================
   EJS
========================= */

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* =========================
   ROUTES
========================= */

const routes = require('./app');
app.use('/', routes);

/* =========================
   PORT
========================= */

const PORT = process.env.PORT || 3000;

/* =========================
   START APP (ВАЖЛИВО)
========================= */

async function startServer() {
    try {

        const dbURI =
            process.env.MONGODB_URI ||
            'mongodb://127.0.0.1:27017/qrfound';

        // 1. ПІДКЛЮЧАЄМО MONGO ПЕРШИМ
        await mongoose.connect(dbURI);

        console.log('✅ MongoDB connected');

        // 2. ТІЛЬКИ ТЕПЕР ЗАПУСКАЄМО СЕРВЕР
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error('MongoDB connection error:');
        console.error(err);
    }
}

startServer();