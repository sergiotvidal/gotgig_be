'use strict';

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
const sendgridMail = require('@sendgrid/mail');
const mySqlPool = require('../../../database/mysql-pool');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

function validateSchema(payload) {
  const schema = {
    full_name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };
  return Joi.validate(payload, schema);
}

async function addVerificationCode(uuid) {
  const verificationCode = uuidV4();

  const sqlAddVerificationCodeQuery = `UPDATE organizations SET verification_code = '${verificationCode}' WHERE uuid = '${uuid}'`;
  const connection = await mySqlPool.getConnection();

  await connection.query(sqlAddVerificationCodeQuery);

  connection.release();

  return verificationCode;
}

async function registrationEmailSender(userEmail, verificationCode) {
  const activationURL = `${process.env.API_BASE_URL}/account/activate?verification_code=${verificationCode}`;
  const msg = {
    to: userEmail,
    from: {
      email: 'gotgig-registration@yopmail.com',
      name: 'gotgig',
    },
    subject: 'Bienvenido a Gotgig!',
    text: 'Complete su proceso de registro activando su cuenta',
    html: `Para finalizar su registro, haga click <a href="${activationURL}">aquí</a>`,
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function createAccount(req, res) {
  const accountData = req.body;

  try {
    await validateSchema(accountData);
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const uuid = uuidV4();
  const securePassword = await bcrypt.hash(accountData.password, 10);
  const now = new Date();
  const creationDateFormatted = now.toISOString().substring(0, 19).replace('T', ' ');

  const connection = await mySqlPool.getConnection();

  const getEmailQuery = `SELECT * FROM organizations where email = '${accountData.email}'`;

  const createAccountQuery = 'INSERT INTO organizations SET ?';

  try {
    const [emailCheckResult] = await connection.query(getEmailQuery);

    if (emailCheckResult.length !== 0) {
      return res.status(400).send('Email already exists in database');
    }

    const result = await connection.query(createAccountQuery, {
      uuid,
      email: accountData.email,
      password: securePassword,
      created_at: creationDateFormatted,
      full_name: accountData.full_name,
    });

    const verificationCode = await addVerificationCode(uuid);

    await registrationEmailSender(accountData.email, verificationCode);

    connection.release();

    return res.status(201).send(result);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    return res.status(500).send(e.message);
  }
}

module.exports = createAccount;
