'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('../../../database/mysql-pool');
const insertBandIntoDatabase = require('../band/add-band-to-database');
const getBandDataFromDatabase = require('../band/get-band-data-from-database');

async function concertDataValidator(payload) {
  const schema = {
    band: Joi.string().required(),
    date: Joi.number().required(),
    tickets: Joi.string(),
    style: Joi.string(),
    website: Joi.string(),
    description: Joi.string(),
  };
  /**
   * TODO: definir el formato de .date(),
   * ¿qué me traigo del front?
   * ¿En qué formato me viene de front, en qué formato la convierto para almacenarla?
   */

  return Joi.validate(payload, schema);
}

async function createConcert(req, res) {
  const concertData = { ...req.body };
  const { id_concerthall: idConcerthall } = req.params;

  try {
    await concertDataValidator(concertData);
  } catch (e) {
    return res.status(401).send(e.message);
  }

  const connection = await mySqlPool.getConnection();
  const insertConcert = 'INSERT INTO concerts SET ?';
  const isBandAlreadyInDatabaseQuery = `SELECT * FROM bands WHERE full_name = '${concertData.band}'`;

  try {
    const [isBandAlreadyInDatabase] = await connection.query(isBandAlreadyInDatabaseQuery);

    if (isBandAlreadyInDatabase.length === 0) {
      await insertBandIntoDatabase(concertData);
    }

    const idBand = await getBandDataFromDatabase(concertData.band);

    const timeStampDate = new Date(concertData.date).getTime();

    await connection.query(insertConcert, {
      id_localhall: idConcerthall,
      id_band: idBand,
      date: timeStampDate,
      tickets: concertData.tickets,
    });

    connection.release();

    return res.status(201).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    return res.status(500).send(e.message);
  }
}

module.exports = createConcert;
