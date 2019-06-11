'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function updateBandData(concertData) {
  const connection = await mySqlPool.getConnection();
  const updateBandDataQuery = `UPDATE bands SET ? WHERE id_band = '${concertData.idBand}'`;

  await connection.query(updateBandDataQuery, {
    style: concertData.style,
    description: concertData.description,
    website: concertData.website,
  });
}

module.exports = updateBandData;
