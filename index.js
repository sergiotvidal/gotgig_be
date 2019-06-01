'use strict';

/**
 * Loads environment variables from .env file into process.env
 */
require('dotenv').config();

const express = require('express');

const app = express();


const port = process.env.PORT;

app.listen(port, function () {
  console.log(`App listening on ${port}!`);
});