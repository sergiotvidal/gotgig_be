'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getBandDataFromDatabase(band) {
  const connection = await mySqlPool.getConnection();
  const getBandDataQuery = `SELECT id_band FROM bands WHERE full_name = '${band}'`;

  const [bandData] = await connection.query(getBandDataQuery);

  const idBand = bandData[0].id_band;

  return idBand;
}

module.exports = getBandDataFromDatabase;
