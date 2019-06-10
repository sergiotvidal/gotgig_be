'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function insertBandData(concertData) {
  const connection = await mySqlPool.getConnection();
  const createBandQuery = 'INSERT INTO bands SET ?';

  await connection.query(createBandQuery, {
    full_name: concertData.band,
    style: concertData.style,
    description: concertData.description,
    website: concertData.website,
  });
}

module.exports = insertBandData;
