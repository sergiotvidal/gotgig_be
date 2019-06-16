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

  const { dist } = req.query;

  //   const { full_name } = req.query;

  const connection = await mySqlPool.getConnection();

  if (dist) {
    try {
      const { lat: googleLat, lng: googleLng } = await getCoordinatesFromGoogleMaps(location);

      const getDataQuery = `SELECT c.id_localhall, c.date, c.hour, c.tickets, b.full_name, b.style, b.description, b.website,
      l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
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
    HAVING distance < ${dist}
    ORDER BY c.id_localhall, distance, c.date`;

      const [resultData] = await connection.query(getDataQuery);

      return res.status(200).send(resultData);
    } catch (e) {
      if (connection) {
        connection.release();
      }
      return res.status(500).send(e.message);
    }
  }

  if (location) {
    try {
      const { lat: googleLat, lng: googleLng } = await getCoordinatesFromGoogleMaps(location);

      const getDataQuery = `SELECT c.id_localhall, c.date, c.hour, c.tickets, b.full_name, b.style, b.description, b.website,
        l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
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
      ORDER BY c.id_localhall, distance, c.date`;

      const [resultData] = await connection.query(getDataQuery);

      return res.status(200).send(resultData);
    } catch (e) {
      if (connection) {
        connection.release();
      }
      return res.status(500).send(e.message);
    }
  }
  try {
    const getDataQuery = `SELECT c.id_localhall, c.date, c.hour, c.tickets, b.full_name, b.style, b.description, b.website,
    l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
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
  ORDER BY c.id_localhall, distance, c.date`;

    const [resultData] = await connection.query(getDataQuery);

    return res.status(200).send(resultData);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = mainSearchController;
