/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable security/detect-object-injection */
/* eslint-disable implicit-arrow-linebreak */

'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getOrganizationId(uuid) {
  const connection = await mySqlPool.getConnection();

  const getOrganizationIdQuery = `SELECT id_organization FROM organizations WHERE uuid = '${uuid}'`;

  const [organizationIdResult] = await connection.query(getOrganizationIdQuery);

  const { id_organization: organizationId } = organizationIdResult[0];

  return organizationId;
}

async function getConcertsData(req, res) {
  const { uuid } = req.claims;

  const connection = await mySqlPool.getConnection();

  try {
    const organizationId = await getOrganizationId(uuid);
    const getConcerthallsIdsQuery = `SELECT id_localhall FROM localhalls WHERE id_organization = '${organizationId}'`;

    const [concerthallsIdsResult] = await connection.query(getConcerthallsIdsQuery);

    const concerthallsIds = concerthallsIdsResult.map(localhall => localhall.id_localhall);

    const concerthallsIdsFormattedForQuery = concerthallsIds.join(' OR ');

    const getConcertsQuery = `SELECT * FROM concerts WHERE id_localhall = ${concerthallsIdsFormattedForQuery} ORDER BY date`;

    const [getConcertsResult] = await connection.query(getConcertsQuery);

    // const groupBy = key => array =>
    //   array.reduce((objectsByKeyValue, obj) => {
    //     const value = obj[key];
    //     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    //     return objectsByKeyValue;
    //   }, {});

    // const groupById = groupBy('id_localhall');

    // const concertsGroupedByLocalhallId = [groupById(getConcertsResult)];


    const bandIds = getConcertsResult.map(localhall => localhall.id_band).sort((a, b) => a > b).join(' OR ');
    const getBandsQuery = `SELECT * FROM bands WHERE id_band = ${bandIds}`;
    const [getBandsResult] = await connection.query(getBandsQuery);

    const userConcertsAndBands = {
      // me devuelven el objeto que quiero si les pongo [0]
      getConcertsResult,
      getBandsResult,
    };
    return res.status(200).send(userConcertsAndBands);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = getConcertsData;
