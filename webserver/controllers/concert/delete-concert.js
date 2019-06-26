'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function deleteConcert(req, res) {
  const { id_concert: idConcert } = req.params;

  const connection = await mySqlPool.getConnection();
  const deleteConcertQuery = `DELETE FROM concerts WHERE id_concert = '${idConcert}'`;

  try {
    await connection.query(deleteConcertQuery);

    connection.release();

    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = deleteConcert;
