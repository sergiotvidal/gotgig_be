'use strict';

const express = require('express');
const concertController = require('../controllers/concert/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();

router.post('/user/concert/:id_concerthall', jwtCheck, concertController.addConcert);
router.put('/user/concert/:id_concerthall/:id_concert', jwtCheck, concertController.updateConcert);
router.delete('/user/concert/:id_concerthall/:id_concert', jwtCheck, concertController.deleteConcert);
router.get('/user/concerts', jwtCheck, concertController.getConcerts);

module.exports = router;
