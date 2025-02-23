const express = require('express');
const cors = require('cors');

const app = express();

app.use(
    cors({
        credentials: true,
        origin: '*',
        allowedHeaders: '*'
    })
);

app.use(express.json());

app.use('/', require('./router'));

module.exports = app;
