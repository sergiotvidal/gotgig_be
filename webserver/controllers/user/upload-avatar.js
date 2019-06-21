/* eslint-disable consistent-return */

'use strict';

const cloudinary = require('cloudinary');
const mySqlPool = require('../../../database/mysql-pool');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadUserAvatar(req, res) {
  const { file } = req;
  const { uuid } = req.claims;

  if (!file || !file.buffer) {
    return res.status(400).send();
  }

  cloudinary.v2.uploader.upload_stream({
    resource_type: 'raw',
    public_id: uuid,
    width: 200,
    height: 200,
    format: 'jpg',
    crop: 'limit',
  }, async(err, result) => {
    if (err) {
      return res.status(400).send(err);
    }

    const { secure_url: secureUrl } = result;

    const connection = await mySqlPool.getConnection();
    const updateAvatarUserQuery = `UPDATE organizations SET ? WHERE uuid = '${uuid}'`;

    try {
      await connection.query(updateAvatarUserQuery, {
        avatar: secureUrl,
      });

      connection.release();
    } catch (e) {
      if (connection) {
        connection.release();
      }
      return res.status(500).send(e.message);
    }

    connection.release();
    res.header('Location', secureUrl);
    res.status(201).send();
  }).end(file.buffer);
}

module.exports = uploadUserAvatar;
