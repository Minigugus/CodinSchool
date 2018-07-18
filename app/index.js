'use strict';

const express = require('express');

const config = require('./config');

const app = express();

app.set('trust proxy', 1);

app.use(config.root, require('./routes'));

module.exports = app;