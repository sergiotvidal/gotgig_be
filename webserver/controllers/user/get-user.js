'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getConcertHallsData(idOrganization) {
  const connection = await mySqlPool.getConnection();

  const getConcertHallsDataQuery = `SELECT address, description, website, full_name, phone_number, id_localhall FROM localhalls WHERE id_organization = '${idOrganization}'`;

  const [concertHallsData] = await connection.query(getConcertHallsDataQuery);

  return concertHallsData;
}

async function getConcertsData(concertHallIds) {
  const connection = await mySqlPool.getConnection();

  const getConcertsDataQuery = `SELECT id_concert, date, hour, tickets FROM concerts WHERE id_localhall = '${concertHallIds}'`;

  const [concertsData] = await connection.query(getConcertsDataQuery);

  return concertsData;
}

async function getUserProfile(req, res) {
  const { uuid } = req.claims;
  const connection = await mySqlPool.getConnection();
  const getOrganizationDataQuery = `SELECT full_name, avatar, email FROM organizations WHERE o.uuid = '${uuid}'`;
  try {
    const [organizationData] = await connection.query(getOrganizationDataQuery);
    const { id_organization: idOrganization } = organizationData[0];

    const concertHallsData = await getConcertHallsData(idOrganization);

    const concertHallIds = concertHallsData.map(localhall => localhall.id_localhall);

    const concertsData = await getConcertsData(concertHallIds);

    const completeUserData = {
      organizationData: {
        concertHallsData: {
          concertsData,
        },
      },
    };

    res.status(200).send(completeUserData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    res.status(500).send(e.message);
  }
}

module.exports = getUserProfile;


// const getUserInfoQuery = `SELECT l.id_localhall, c.id_concert, o.full_name, o.avatar, o.email, l.address, l.description, l.website, l.full_name, l.phone_number,
// c.date, c.hour, c.tickets, b.id_band, b.description, b.full_name, b.style, b.website
// FROM organizations o
// LEFT JOIN localhalls l ON o.id_organization = l.id_organization
// INNER JOIN concerts c ON l.id_localhall = c.id_localhall
// RIGHT JOIN bands b ON c.id_band = b.id_band
// WHERE o.uuid = '${uuid}'
// GROUP BY l.id_localhall, c.id_concert
// ORDER BY l.id_localhall, c.date`;