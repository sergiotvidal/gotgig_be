'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getUserData(req, res) {
  const { uuid } = req.claims;
  const connection = await mySqlPool.getConnection();
  const getOrganizationDataQuery = `SELECT full_name, avatar, email, id_organization FROM organizations WHERE uuid = '${uuid}'`;
  try {
    const [organizationData] = await connection.query(getOrganizationDataQuery);

    const { id_organization: idOrganization } = organizationData[0];

    const getConcerthallsDataQuery = `SELECT address, description, website, full_name, phone_number, id_localhall 
    FROM localhalls
    WHERE id_organization = '${idOrganization}'`;

    const [concerthallsData] = await connection.query(getConcerthallsDataQuery);

    const getConcertsDataQuery = `SELECT c.id_localhall, c.date, c.tickets, c.id_concert, b.full_name, b.style, b.description, b.website 
    FROM organizations o
    RIGHT JOIN localhalls l ON o.id_organization = l.id_organization
    RIGHT JOIN concerts c ON l.id_localhall = c.id_localhall
    RIGHT JOIN bands b ON c.id_band = b.id_band
    WHERE o.uuid = '${uuid}'
    ORDER BY c.date`;

    const [concertsData] = await connection.query(getConcertsDataQuery);

    const userData = {
      organizationData,
      concerthallsData,
      concertsData,
    };

    connection.release();

    res.status(200).send(userData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    res.status(500).send(e.message);
  }
}

module.exports = getUserData;
