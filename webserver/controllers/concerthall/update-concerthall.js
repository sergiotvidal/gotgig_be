'use strict';

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLEMAPS_API_KEY,
  Promise,
});
const mySqlPool = require('../../../database/mysql-pool');

async function getCoordinatesFromGoogleMaps(concerthallAddress) {
  const response = await googleMapsClient.geocode({ address: concerthallAddress }).asPromise();

  const { lat, lng } = response.json.results[0].geometry.location;

  const coordinates = {
    lat,
    lng,
  };

  return coordinates;
}

async function updateConcertHall(req, res) {
  const concerthallData = { ...req.body };
  const { id_concerthall: idConcerthall } = req.params;

  const updateConcertHallQuery = `UPDATE localhalls SET ? WHERE id_localhall = '${idConcerthall}'`;

  const connection = await mySqlPool.getConnection();
  try {
    if (concerthallData.address) {
      const location = await getCoordinatesFromGoogleMaps(concerthallData.address);
      const { lat, lng } = location;

      await connection.query(updateConcertHallQuery, {
        address: concerthallData.address,
        lat,
        lng,
      });
    }

    await connection.query(updateConcertHallQuery, {
      full_name: concerthallData.full_name,
      website: concerthallData.website,
      phone_number: concerthallData.phone_number,
      description: concerthallData.description,
    });

    connection.release();

    return res.status(200).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }
    return res.status(500).send(e.message);
  }
}

module.exports = updateConcertHall;
