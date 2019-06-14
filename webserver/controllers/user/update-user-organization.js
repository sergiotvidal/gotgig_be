'use strict';

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const mySqlPool = require('../../../database/mysql-pool');

async function validateData(payload) {
  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    full_name: Joi.string(),
  };

  return Joi.validate(payload, schema);
}

async function updateUserOrganization(req, res) {
  const connection = await mySqlPool.getConnection();
  const { uuid } = req.claims;
  const updateOrganizationData = req.body;

  try {
    await validateData(updateOrganizationData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const updateUserOrganizationQuery = `UPDATE organizations SET ? WHERE uuid = '${uuid}'`;

  try {
    const securePassword = await bcrypt.hash(updateOrganizationData.password, 10);

    await connection.query(updateUserOrganizationQuery, {
      email: updateOrganizationData.email,
      full_name: updateOrganizationData.full_name,
      password: securePassword,
    });

    connection.release();

    return res.status(209).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = updateUserOrganization;
