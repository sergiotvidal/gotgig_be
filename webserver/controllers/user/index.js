'use strict';

const deleteUserOrganization = require('./delete-user-organization');
const getUserData = require('./get-user-organization');
const updateUserOrganization = require('./update-user-organization');
const uploadUserAvatar = require('./upload-avatar');

module.exports = {
  deleteUserOrganization,
  getUserData,
  updateUserOrganization,
  uploadUserAvatar,
};
