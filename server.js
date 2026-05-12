require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

/* SERVE HTML HOME PAGE */
app.use('/', express.static(path.join(__dirname, 'public')));

/* API ROUTES */
app.use('/states', require('./routes/api/states'));

/* 404 HANDLER */
app.use((req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

mongoose.connect(process.env.DATABASE_URI);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
