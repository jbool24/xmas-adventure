'use strict';

const qs            = require('querystring');
const SMSResponse   = require('twilio').twiml.MessagingResponse;
const twilio        = require('./client');

const debug = console.log;

exports.sendSMS = function sendSMS(options = {}) {
    const twilioParams = {
        body: options.body,
        from: options.source ?  options.source : process.env.TWILIO_NUMBER,
        to:   options.destination || undefined
    };

    if (options.webhookURL) twilioParams.statusCallback = options.webhookURL;


    return new Promise((resolve, reject) => {
        if (! ('destination' in options) ) {
            reject(new Error('Must supply a destination phone number in order to send an SMS'));
            return;
        }

        twilio.messages.create(twilioParams)
            .then(msg => {
                debug(`---- Twilio Message Created - Status ${msg.status} ----`);
                debug('Msg Status: %s', msg.status);
                debug('To: %s', msg.to);
                debug('From: %s', msg.from);
                debug('Body: %s', msg.body);
                debug('------------------------------------------------------');
                return resolve();
            })
            .catch(err => {
                console.error(err);
                return reject(new Error('Twilio network failure'));
            })
            .done();
    });
};
