'use strict';

const express = require('express');

const { api, APIError } = require('../../api');

module.exports = express.Router()
.get('/', api((req, res, next) => new Promise(res => req.session.destroy(err => res(null)))));