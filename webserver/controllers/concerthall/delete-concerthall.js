'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function deleteConcerthall(req, res) {
  const idConcerthall = req.params.id_concerthall;
  const connection = await mySqlPool.getConnection();
  const deleteConcertsQuery = `DELETE FROM concerts WHERE id_localhall = '${idConcerthall}'`;
  const deleteConcerthallQuery = `DELETE FROM localhalls WHERE id_localhall = '${idConcerthall}'`;
  try {
    await connection.query(deleteConcertsQuery);
    await connection.query(deleteConcerthallQuery);
    connection.release();
    return res.status(200).redirect('/user');
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = deleteConcerthall;
