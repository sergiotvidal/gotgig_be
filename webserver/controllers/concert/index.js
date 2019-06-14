'use strict';

const addConcert = require('./create-concert');
const deleteConcert = require('./delete-concert');
const getConcerts = require('./get-concerts');
const updateConcert = require('./update-concert');

module.exports = {
  addConcert,
  deleteConcert,
  getConcerts,
  updateConcert,
};
