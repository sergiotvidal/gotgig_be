'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function deleteUserOrganization(req, res) {
  const { uuid } = req.claims;
  const connection = await mySqlPool.getConnection();

  const getOrganizationIdQuery = `SELECT id_organization FROM organizations WHERE uuid = '${uuid}'`;
  const deleteUserOrganizationQuery = `DELETE FROM organizations WHERE uuid = '${uuid}'`;


  try {
    const [organizationId] = await connection.query(getOrganizationIdQuery);

    const { id_organization: idOrganization } = organizationId[0];

    const getConcerthallsIdsQuery = `SELECT id_localhall FROM localhalls WHERE id_organization = '${idOrganization}'`;
    const deleteConcerthallsQuery = `DELETE FROM localhalls WHERE id_organization = '${idOrganization}'`;

    const [concerthallsIds] = await connection.query(getConcerthallsIdsQuery);

    const concerthallIdsIndexes = concerthallsIds.map(localhall => localhall.id_localhall);

    const concertHallsIdsSplittedForQuery = concerthallIdsIndexes.join(' OR ');

    const deleteConcertsQuery = `DELETE FROM concerts WHERE id_localhall = ${concertHallsIdsSplittedForQuery}`;

    await connection.query(deleteConcertsQuery);
    await connection.query(deleteConcerthallsQuery);
    await connection.query(deleteUserOrganizationQuery);

    connection.release();

    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = deleteUserOrganization;
