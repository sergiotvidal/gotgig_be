'use strict';

const express = require('express');
const userController = require('../controllers/user/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();
