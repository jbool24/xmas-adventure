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

    const html = template
            .replace(/{{ answerID }}/g, req.params.id)
            .replace(/{{ riddle }}/g, textMessage[0]);

    res.send(html);
})

router.get('/answer/:id', (req, res) => {
    const textMessage = textGet(`questions:${req.params.id}`);

    res.send(template.replace(/{{ riddle }}/g, textMessage[1]));
})

router.get('/final', (req, res) => {

    const message = textGet(`responses:finish`);

    res.send(handleCallPickUp([ message ]));

})

router.post('/response/:msg', validateRequest, (req, res) => {

    let message = textGet(`responses:${req.params.msg}`);
    let firstMessage = '';
    if (req.params.msg === "welcome") {
        firstMessage = textGet(`responses:first`);
    }

    res.send(handleCallPickUp([message, firstMessage]));
});


module.exports = router;
