'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('../../../database/mysql-pool');

async function concertDataValidator(payload) {
  const schema = {
    band: Joi.string().require(),
    date: Joi.date().require(),
    time: Joi.string().require(),
    /** 
     *TODO:check lo que viene del front
     */
  };

  return Joi.validate(payload, schema);
}

async function addConcertToDatabase(req, res) {
  const concertData = { ...req.body };
  const { claims } = req;
  const { uuid } = claims;

  try {
    await concertDataValidator(concertData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

 /**
  * TODO: Hacer la query 
  */

}

module.exports = addConcertToDatabase;
