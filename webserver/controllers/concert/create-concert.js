'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('../../../database/mysql-pool');

async function concertDataValidator(payload) {
  const schema = {
    band: Joi.string().require(),
    date: Joi.date().require(),
    time: Joi.string().require(),
  };

  return Joi.validate(payload, schema);
}

async function addConcertToDatabase(req, res) {
  const concertData = { ...req.body };
  const { uuid } = req.claims;
  const { id_concerthall: idConcerthall } = req.params;

  try {
    await concertDataValidator(concertData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const connection = await mySqlPool.getConnection();
  const insertConcert = '';

}

module.exports = addConcertToDatabase;
