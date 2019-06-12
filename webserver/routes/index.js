'use strict';

const accountRouter = require('./account-router');
const concertRouter = require('./concert-router');
const concerthallRouter = require('./concerthall-router');
const userRouter = require('./user-router');

module.exports = {
  accountRouter,
  concertRouter,
  concerthallRouter,
  userRouter,
};
