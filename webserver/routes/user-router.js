'use strict';

const express = require('express');
const multer = require('multer');
const userController = require('../controllers/user/index');
const jwtCheck = require('../session/check-bearer-token');

const router = express.Router();
const upload = multer();

router.post('/user/avatar', jwtCheck, upload.single('avatar'), userController.uploadUserAvatar);
router.get('/user/organization', jwtCheck, userController.getUserOrganizationData);
router.put('/user/organization', jwtCheck, userController.updateUserOrganization);
router.delete('/user/organization', jwtCheck, userController.deleteUserOrganization);

module.exports = router;
