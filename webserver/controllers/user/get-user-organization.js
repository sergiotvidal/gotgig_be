'use strict';

const mySqlPool = require('../../../database/mysql-pool');

async function getOrganizationData(req, res) {
  const { uuid } = req.claims;
  const connection = await mySqlPool.getConnection();
  const getOrganizationDataQuery = `SELECT full_name, avatar, email, id_organization FROM organizations WHERE uuid = '${uuid}'`;
  try {
    const [organizationData] = await connection.query(getOrganizationDataQuery);

    res.status(200).send(organizationData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    res.status(500).send(e.message);
  }
}

module.exports = getOrganizationData;
