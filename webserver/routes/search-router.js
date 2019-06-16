'use strict';

const express = require('express');
const searchController = require('../controllers/search/index');

const router = express.Router();

router.get('/search', searchController.searchMain);

module.exports = router;
