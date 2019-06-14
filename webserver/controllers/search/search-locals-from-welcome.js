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

async function searchConcerthallsFromWelcome(req, res) {
  const { location } = req.query;

  const connection = await mySqlPool.getConnection();

  try {
    const { lat, lng } = await getCoordinatesFromGoogleMaps(location);

    const { concerts } = req.concerts;

    const searchQuery = `SELECT l.id_localhall, l.full_name, l.address, l.description, l.website, l.phone_number, l.lat, l.lng,
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
    HAVING distance < 10
    ORDER BY distance`;

    const [localhalls] = await connection.query(searchQuery);

    connection.release();

    const result = {
      localhalls,
      concerts,
    };

    return res.status(200).send(result);
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = searchConcerthallsFromWelcome;
