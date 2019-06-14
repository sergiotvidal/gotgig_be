'use strict';

const deleteUserOrganization = require('./delete-user-organization');
const getUserOrganizationData = require('./get-user-organization');
const getUserConcerthallsData = require('./get-user-concerthalls');
const getUserConcertData = require('./get-user-concerts');
const updateUserOrganization = require('./update-user-organization');
const uploadUserAvatar = require('./upload-avatar');

module.exports = {
  deleteUserOrganization,
  getUserOrganizationData,
  getUserConcerthallsData,
  getUserConcertData,
  updateUserOrganization,
  uploadUserAvatar,
};
