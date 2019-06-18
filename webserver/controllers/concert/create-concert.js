'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('../../../database/mysql-pool');

async function concertDataValidator(payload) {
  const schema = {
    band: Joi.string().required(),
    date: Joi.date().required(),
    tickets: Joi.string(),
    style: Joi.string(),
    website: Joi.string(),
    description: Joi.string(),
  };

  return Joi.validate(payload, schema);
}

async function insertBandIntoDatabase(concertData) {
  const connection = await mySqlPool.getConnection();
  const createBandQuery = 'INSERT INTO bands SET ?';

  await connection.query(createBandQuery, {
    full_name: concertData.band,
    style: concertData.style,
    description: concertData.description,
    website: concertData.website,
  });
}

async function getBandDataFromDatabase(band) {
  const connection = await mySqlPool.getConnection();
  const getBandDataQuery = `SELECT id_band FROM bands WHERE full_name = '${band}'`;

  const [bandData] = await connection.query(getBandDataQuery);

  const idBand = bandData[0].id_band;

  return idBand;
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
  const insertConcertQuery = 'INSERT INTO concerts SET ?';
  const isBandAlreadyInDatabaseQuery = `SELECT * FROM bands WHERE full_name = '${concertData.band}'`;

  try {
    const [isBandAlreadyInDatabase] = await connection.query(isBandAlreadyInDatabaseQuery);

    if (isBandAlreadyInDatabase.length === 0) {
      await insertBandIntoDatabase(concertData);
    }

    const idBand = await getBandDataFromDatabase(concertData.band);

    await connection.query(insertConcertQuery, {
      id_localhall: idConcerthall,
      id_band: idBand,
      date: concertData.date,
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
