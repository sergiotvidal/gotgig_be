'use strict';

const activateAccount = require('./activate-account-controller');
const createAccount = require('./register-account-controller');
const loginAccount = require('./login-account-controller');

module.exports = {
  activateAccount,
  createAccount,
  loginAccount,
};
