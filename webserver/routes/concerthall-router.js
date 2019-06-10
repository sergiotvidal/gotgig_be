'use strict';

const express = require('express');
const concerthallController = require('../controllers/concerthall/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();

router.post('/user/concerthall', jwtCheck, concerthallController.createConcertHall);
router.put('/user/concerthall/:id_concerthall', jwtCheck, concerthallController.updateConcertHall);
router.delete('/user/concerthall/:id_concerthall', jwtCheck, concerthallController.deleteConcertHall);

module.exports = router;
