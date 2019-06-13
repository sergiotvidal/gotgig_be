'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getOrganizationId(uuid) {
  const connection = await mySqlPool.getConnection();

  const getOrganizationIdQuery = `SELECT id_organization FROM organizations WHERE uuid = '${uuid}'`;

  const [organizationIdResult] = await connection.query(getOrganizationIdQuery);

  const { id_organization: organizationId } = organizationIdResult[0];

  return organizationId;
}

async function getConcertHallsData(req, res) {
  const { uuid } = req.claims;
  const connection = await mySqlPool.getConnection();

  try {
    const idOrganization = await getOrganizationId(uuid);

    const getConcertHallsDataQuery = `SELECT address, description, website, full_name, phone_number, id_localhall FROM localhalls WHERE id_organization = '${idOrganization}'`;
    const [concertHallsData] = await connection.query(getConcertHallsDataQuery);

    return res.status(200).send(concertHallsData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = getConcertHallsData;
