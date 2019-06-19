'use strict';

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLEMAPS_API_KEY,
  Promise,
});
const mySqlPool = require('../../../database/mysql-pool');

async function getCoordinatesFromGoogleMaps(searchAddress) {
  const response = await googleMapsClient.geocode({ address: searchAddress }).asPromise();

  const { lat, lng } = response.json.results[0].geometry.location;

  const coordinates = {
    lat,
    lng,
  };

  return coordinates;
}

async function mainSearchController(req, res) {
  const { lat, lng } = req.query;

  const { location } = req.query;

  const connection = await mySqlPool.getConnection();

  if (location) {
    try {
      const { lat: googleLat, lng: googleLng } = await getCoordinatesFromGoogleMaps(location);

      const getConcerthallsDataQuery = `SELECT l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
      (
          6371 * acos (
            cos ( radians(${googleLat}) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(${googleLng}) )
            + sin ( radians(${googleLat}) )
            * sin( radians( lat ) )
          )
        ) AS distance
      FROM localhalls l
      HAVING distance < 5
      ORDER BY distance`;

      const [concerthallsData] = await connection.query(getConcerthallsDataQuery);

      const getConcertsDataQuery = `SELECT c.id_localhall, c.date, c.tickets, b.full_name AS band, b.style, b.description, b.website,
    (
        6371 * acos (
          cos ( radians(${googleLat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${googleLng}) )
          + sin ( radians(${googleLat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
    FROM localhalls l
    RIGHT JOIN concerts c ON l.id_localhall = c.id_localhall
    RIGHT JOIN bands b ON c.id_band = b.id_band
    HAVING distance < 5
    ORDER BY c.id_localhall, c.date`;

      const [concertsData] = await connection.query(getConcertsDataQuery);

      const resultData = {
        concerthallsData,
        concertsData,
        coordinates: {
          googleLat,
          googleLng,
        },
      };

      return res.status(200).send(resultData);
    } catch (e) {
      if (connection) {
        connection.release();
      }
      return res.status(500).send(e.message);
    }
  }

  try {
    const getConcerthallsDataQuery = `SELECT l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
      (
          6371 * acos (
            cos ( radians(${lat}) )
            * cos( radians( lat ) )
            * cos( radians( lng ) - radians(${lng}) )
            + sin ( radians(${lat}) )
            * sin( radians( lat ) )
          )
        ) AS distance
      FROM localhalls l
      HAVING distance < 5
      ORDER BY distance`;

    const [concerthallsData] = await connection.query(getConcerthallsDataQuery);

    const getConcertsDataQuery = `SELECT c.id_localhall, c.date, c.tickets, b.full_name AS band, b.style, b.description, b.website,
    (
        6371 * acos (
          cos ( radians(${lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${lng}) )
          + sin ( radians(${lat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
    FROM localhalls l
    RIGHT JOIN concerts c ON l.id_localhall = c.id_localhall
    RIGHT JOIN bands b ON c.id_band = b.id_band
    HAVING distance < 5
    ORDER BY c.id_localhall, c.date`;

    const [concertsData] = await connection.query(getConcertsDataQuery);

    const resultData = {
      concerthallsData,
      concertsData,
      coordinates: {
        lat,
        lng,
      },
    };

    return res.status(200).send(resultData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = mainSearchController;
