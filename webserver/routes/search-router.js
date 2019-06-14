'use strict';

const express = require('express');
const searchController = require('../controllers/search/index');

const router = express.Router();

router.get('/search', searchController.searchConcertsFromWelcome, searchController.searchConcerthallsFromWelcome);

module.exports = router;
