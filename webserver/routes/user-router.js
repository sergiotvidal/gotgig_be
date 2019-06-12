'use strict';

const express = require('express');
const multer = require('multer');
const userController = require('../controllers/user/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();
const upload = multer();

router.post('/user/avatar', jwtCheck, upload.single('avatar'), userController.updateUserAvatar);
router.get('/user', jwtCheck, userController.getUserProfile);

module.exports = router;
