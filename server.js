const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

/* =========================
   STATIC FILES
========================= */

app.use(express.static(
    path.join(__dirname, 'public')
));

/* =========================
   EJS TEMPLATE ENGINE
========================= */

app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'views')
);

/* =========================
   MONGODB CONNECTION
========================= */

// Render environment variable
const dbURI =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27017/qrfound';

// Connect MongoDB
mongoose.connect(dbURI)

    .then(() => {

        console.log('✅ MongoDB connected');

    })

    .catch((err) => {

        console.error('❌ MongoDB connection error:');

        console.error(err);

    });

/* =========================
   ROUTES
========================= */

const routes = require('./app');

app.use('/', routes);

/* =========================
   SERVER
========================= */

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});