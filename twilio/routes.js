'use strict';

const express = require('express');
const twilio  = require('twilio');
const url     = require('url');
const fs      = require('fs');
const path    = require('path');

const router  = express.Router();
const template = fs.readFileSync(path.join(__dirname, '../public/riddle.html'),'utf8');

const {
    handleCallPickUp,
    handleResponse,
    finishCall  } = require('./VoiceHandlers');
const { sendSMS } = require('./SMSHandlers');
const { textGet, getRegisteredNumbers } = require("../helpers");

const HOSTURL = process.env.HOSTURL;

const validateRequest = twilio.webhook(process.env.TWILIO_AUTH_TOKEN, {
    host: url.parse(HOSTURL).hostname,
    protocol: 'https'
});

router.get('/question/:id', (req, res) => {
    const textMessage = textGet(`questions:${req.params.id}`);

    console.log(textMessage);

    for ( let number in getRegisteredNumbers() ) {
        console.log(`Texting ${destination} with ${textMessage}`)
        sendSMS({ destination: number, body: textMessage[0] })
    }
    res.send(template.replace(/{{.*}}/g, textMessage[0]));
})

router.get('/answer/:id', (req, res) => {
    const textMessage = textGet(`questions:${req.params.id}`);

    console.log(textMessage);

    res.send(template.replace(/{{.*}}/g, textMessage[1]));
})

router.get('/finish', (req, res) => {
    const textMessage = textGet(`questions:${req.params.id}`);

    console.log(textMessage);

    res.send(template.replace(/{{.*}}/g, textMessage[1]));
})


router.post('/response/:msg', validateRequest, (req, res) => {

    let welcomeMessage = textGet(`responses:${req.params.msg}`);
    let firstMessage;
    if (req.params.msg === "welcome") {
        firstMessage = textGet(`responses:first`);
    }

    res.send(handleCallPickUp([welcomeMessage, firstMessage]));
})

router.post('/callstatus', (req, res) => {
    debug(`------------- CALL STATUS: ${req.body.CallStatus} ------------`);
    debug(req.body);
    debug('--------------------- END CALL STATUS --------------------');
    res.type('text/plain');
    res.end();
});

module.exports = router;
