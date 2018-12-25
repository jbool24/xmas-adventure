'use strict';

const qs            = require('querystring');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const twilio        = require('./client');

const debug = console.log;

exports.initiateCall = function initiateCall(options = {}) {
    const twilioParams = {
        url:  options.webhookURL,
        statusCallback: process.env.HOSTURL + '/callstatus',
        from: options.source ?  options.source : process.env.TWILIO_NUMBER,
        to:   options.destination || undefined
    };

    return new Promise((resolve, reject) => {
        if (!('destination' in options)) {
            reject(new Error('Must supply a destination phone number in order to make a call'));
            return;
        }

        twilio.calls.create(twilioParams)
            .then(call => {
                debug('-------------- Twilio Call Created --------------------');
                debug('Call Status: %s', call.status);
                debug('From: %s', call.fromFormatted);
                debug('To: %s', call.toFormatted);
                debug('-------------------------------------------------------');
                return resolve();
            })
            .catch(err => {
                debug(err);
                return reject(new Error('Twilio network failure'));
            })
            .done();
    });
};

exports.handleCallPickUp = function handleCallPickUp(messages) {
    const twimlResponse = new VoiceResponse();

    for (let message of messages) {
        twimlResponse.say(message, { voice: 'alice', language: 'en-GB'});
        twimlResponse.pause(5);
    }

    twimlResponse.hangup();

    return twimlResponse.toString();
};
