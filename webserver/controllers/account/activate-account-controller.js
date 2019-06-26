'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function activateAccount(req, res) {
  const { verification_code: verificationCode } = req.query;
  const connection = await mysqlPool.getConnection();

  const now = new Date();
  const verificationDate = now.toISOString().substring(0, 19).replace('T', ' ');
  const activationQuery = `UPDATE organizations SET verified_at = '${verificationDate}' WHERE verification_code = '${verificationCode}'`;

  try {
    await connection.query(activationQuery);

    connection.release();

    return res.status(302).redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = activateAccount;
