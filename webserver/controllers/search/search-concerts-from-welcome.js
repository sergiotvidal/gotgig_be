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

async function searchConcertsFromWelcome(req, res, next) {
  const { location } = req.query;

  const connection = await mySqlPool.getConnection();

  try {
    const { lat, lng } = await getCoordinatesFromGoogleMaps(location);

    const searchQuery = `SELECT c.id_localhall, c.date, c.hour, c.tickets, b.full_name, b.style, b.description, b.website, 
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
    HAVING distance < 10
    ORDER BY c.id_localhall, c.date`;

    const [concerts] = await connection.query(searchQuery);

    connection.release();

    req.concerts = {
      concerts,
    };

    return next();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = searchConcertsFromWelcome;
