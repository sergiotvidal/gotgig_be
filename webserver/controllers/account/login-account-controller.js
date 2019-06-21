'use strict';

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mySqlPool = require('../../../database/mysql-pool');

async function validateData(payload) {
  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };

  return Joi.validate(payload, schema);
}

async function loginUser(req, res) {
  const accountData = { ...req.body };
  try {
    await validateData(accountData);
  } catch (e) {
    return res.status(400).send(e.message);
  }
  const connection = await mySqlPool.getConnection();

  try {
    const getUserInfoQuery = `SELECT
      id_organization, uuid, email, password, verified_at
      FROM organizations
      WHERE email = '${accountData.email}'`;

    const [result] = await connection.query(getUserInfoQuery);

    if (result.length === 1) {
      const userData = result[0];

      if (!userData.verified_at) {
        return res.status(403).send();
      }

      const passwordCheck = await bcrypt.compare(accountData.password, userData.password);

      if (passwordCheck === false) {
        return res.status(401).send();
      }

      const payloadJwt = {
        uuid: userData.uuid,
      };

      const jwtExpirationTime = parseInt(process.env.AUTH_JWT_EXPIRATION_TIME, 10);

      const accessToken = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
        expiresIn: jwtExpirationTime,
      });
      const response = {
        accessToken,
        expiresIn: jwtExpirationTime,
      };

      connection.release();

      return res.status(200).send(response);
    }

    return res.status(404).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = loginUser;
