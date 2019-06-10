'use strict';

const express = require('express');
const concerthallController = require('../controllers/concerthall/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();

router.post('/user/concerthall', jwtCheck, concerthallController.createConcertHall);

module.exports = router;
