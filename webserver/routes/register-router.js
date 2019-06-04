'use strict';

const express = require('express');
const createAccountController = require('../controllers/register-controller');

const router = express.Router();

router.post('/account/register', createAccountController);

module.exports = router;
