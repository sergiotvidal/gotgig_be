/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable security/detect-object-injection */
/* eslint-disable implicit-arrow-linebreak */

'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getConcertsData(req, res) {
  const { uuid } = req.claims;

  const connection = await mySqlPool.getConnection();

  const getConcertsDataQuery = `SELECT c.id_localhall, c.date, c.tickets, c.id_concert, b.full_name, b.style, b.description, b.website 
  FROM localhalls l
  LEFT JOIN organizations o ON o.id_organization = l.id_organization
  RIGHT JOIN concerts c ON l.id_localhall = c.id_localhall
  RIGHT JOIN bands b ON c.id_band = b.id_band
  WHERE o.uuid = '${uuid}'
  ORDER BY c.date`;

  try {
    const [concertsData] = await connection.query(getConcertsDataQuery);

    return res.status(200).send(concertsData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = getConcertsData;

// const groupBy = key => array =>
//   array.reduce((objectsByKeyValue, obj) => {
//     const value = obj[key];
//     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
//     return objectsByKeyValue;
//   }, {});

// const groupById = groupBy('id_localhall');

// const concertsGroupedByLocalhallId = [groupById(concertsData)];