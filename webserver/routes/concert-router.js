'use strict';

const express = require('express');
const concertController = require('../controllers/concert/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();

router.post('/concert', jwtCheck, concertController.addConcert);
router.delete('/concert', jwtCheck, concertController.deleteConcert);
router.put('/concert', jwtCheck, concertController.updateConcert);

module.exports = router;
