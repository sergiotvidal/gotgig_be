/* eslint-disable arrow-body-style */

'use strict';

const Joi = require('@hapi/joi');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLEMAPS_API_KEY,
  Promise,
});
const mySqlPool = require('../../../database/mysql-pool');

async function validateData(payload) {
  const schema = {
    address: Joi.string().required(),
    full_name: Joi.string().required(),
  };

  return Joi.validate(payload, schema);
}

async function getCoordinatesFromGoogleMaps(concerthallAddress) {
  const response = await googleMapsClient.geocode({ address: concerthallAddress }).asPromise();

  const { lat, lng } = response.json.results[0].geometry.location;

  const coordinates = {
    lat,
    lng,
  };

  return coordinates;
}

async function createConcerthall(req, res) {
  const concertHallData = { ...req.body };
  const { uuid } = req.claims;

  try {
    await validateData(concertHallData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const connection = await mySqlPool.getConnection();
  const createConcerthallQuery = 'INSERT INTO localhalls SET ?';
  const idOrganizationQuery = `SELECT id_organization FROM organizations WHERE uuid = '${uuid}'`;
  const addressAlreadyInDatabaseQuery = `SELECT address FROM localhalls WHERE address = '${concertHallData.address}'`;

  try {
    const [addresses] = await connection.query(addressAlreadyInDatabaseQuery);

    if (addresses.length !== 0) {
      return res.status(409).send('Address already in database');
    }

    const [idOrganizationResult] = await connection.query(idOrganizationQuery);

    const idOrganization = idOrganizationResult[0].id_organization;


    const location = await getCoordinatesFromGoogleMaps(concertHallData.address);
    const { lat, lng } = location;

    await connection.query(createConcerthallQuery, {
      full_name: concertHallData.full_name,
      address: concertHallData.address,
      id_organization: idOrganization,
      website: concertHallData.website,
      phone_number: concertHallData.phone_number,
      description: concertHallData.description,
      lat,
      lng,
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

module.exports = createConcerthall;
