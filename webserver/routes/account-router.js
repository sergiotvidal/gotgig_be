'use strict';

const express = require('express');
const accountController = require('../controllers/account/index');

const router = express.Router();

router.post('/account/register', accountController.createAccount);
router.get('/account/activate', accountController.activateAccount);
// router.post('/account/login', accountController.loginAccount);

module.exports = router;
