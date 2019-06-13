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

async function searchFromWelcome (req, res) {
  
}

module.exports = searchFromWelcome;
