'use strict';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTHTOKEN = process.env.TWILIO_AUTH_TOKEN;

console.log(`\tStarting Twilio client with SID: ${ACCOUNT_SID}\n\tToken: ${AUTHTOKEN.slice(-5).padStart(AUTHTOKEN.length, '*')}`)
const twilioClient = require('twilio')(ACCOUNT_SID, AUTHTOKEN);

module.exports = twilioClient;