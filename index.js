'use strict';

/**
 * Loads environment variables from .env file into process.env
 */
require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const mysqlPool = require('./database/mysql-pool');

const app = express();
app.use(bodyParser.json());

/**
 *  CORS configuration
 */

app.use((req, res, next) => {
  const accessControlAllowMethods = [
    'GET',
    'POST',
    'DELETE',
    'HEAD',
    'PATCH',
    'PUT',
    'OPTIONS',
  ];

  const accessControlAllowHeaders = [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Accept-Version',
    'Authorization',
    'Location',
  ];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', accessControlAllowMethods.join(','));
  res.header('Access-Control-Allow-Headers', accessControlAllowHeaders.join(','));
  res.header('Access-Control-Expose-Headers', accessControlAllowHeaders.join(','));
  next();
});

/**
 *  Port variable configured for deploy
 */

const port = process.env.PORT;

async function init() {
  try {
    await mysqlPool.connect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`App listening on ${port}!`);
  });
}

init();
