'use strict';

const Joi = require('@hapi/joi');
const mySqlPool = require('../../../database/mysql-pool');
const updateBandData = require('../band/update-band-data');

async function concertDataValidator(payload) {
  const schema = {
    date: Joi.number().required(),
    style: Joi.string(),
    website: Joi.uri().string(),
    description: Joi.string(),
    tickets: Joi.string(),
  };
    /**
     * TODO: definir el formato de .date()
     * ¿qué me traigo del front?
     * ¿En qué formato me viene de front, en qué formato la convierto para almacenarla?
     */

  return Joi.validate(payload, schema);
}

async function updateConcert(req, res) {
  const concertData = { ...req.body };
  const { id_concert: idConcert } = req.params;

  try {
    await concertDataValidator(concertData);
  } catch (e) {
    return res.status(401).send(e.message);
  }

  const connection = await mySqlPool.getConnection();
  const updateConcertQuery = `UPDATE concerts SET ? WHERE id_concert = '${idConcert}'`;
  const getBandIdQuery = `SELECT id_band FROM concerts WHERE id_concert = '${idConcert}'`;

  const timeStampDate = new Date(concertData.date).getTime();

  try {
    await connection.query(updateConcertQuery, {
      date: timeStampDate,
      hour: concertData.hour,
      tickets: concertData.tickets,
    });

    const [resultBandIdQuery] = await connection.query(getBandIdQuery);

    const bandId = resultBandIdQuery[0].id_band;

    const concertDataWithBandId = {
      ...concertData,
      bandId,
    };

    await updateBandData(concertDataWithBandId);

    connection.release();
    return res.status(209).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = updateConcert;
