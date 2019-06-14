'use strict';

const createConcertHall = require('./create-concerthall');
const deleteConcertHall = require('./delete-concerthall');
const getConcertHalls = require('./get-concerthalls');
const updateConcertHall = require('./update-concerthall');

module.exports = {
  createConcertHall,
  deleteConcertHall,
  getConcertHalls,
  updateConcertHall,
};
