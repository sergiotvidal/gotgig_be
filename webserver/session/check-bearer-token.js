'use strict';

const jwt = require('jsonwebtoken');

const { AUTH_JWT_SECRET: authJwtSecret } = process.env;

function checkJwtToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send('Oops! There is no authorization header!');
  }

  const [prefix, token] = authorization.split(' ');
  if (prefix !== 'Bearer') {
    return res.status(401).send('Wrong header');
  }

  if (!token) {
    return res.status(401).send('Where is my token u SOB?');
  }

  try {
    const decoded = jwt.verify(token, authJwtSecret);

    req.claims = {
      uuid: decoded.uuid,
    };

    return next();
  } catch (e) {
    return res.status(401).send();
  }
}

module.exports = checkJwtToken;
