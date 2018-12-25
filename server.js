'use strict';

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

console.log(''.padStart(80,'#'));
console.log('Bootstraping server');
console.log(''.padStart(80,'#'));

if (process.env.NODE_ENV === 'development') {
    console.log('> Importing configs from local');
    dotenv.config();
}

const { registerNumber, getRegisteredNumbers } = require('./helpers');
const twilioRoutes = require('./twilio/routes');
const { initiateCall } = require('./twilio/VoiceHandlers');

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static('./public'))


server.post('/entrypoint', (req, res) => {
    try {
        console.log(req.body);
        registerNumber(req.body.phoneNumber);
        const options = {
            destination: getRegisteredNumbers()[0], 
            webhookURL: `${process.env.HOSTURL}/twilio/response/welcome`
        };
        console.log(options);
        initiateCall(options)
            .then(() => res.redirect('/success.html'))
            .catch((err) => { throw err; });
    } catch(err) {
        console.log(err);
        res.redirect('/oops.html');
    }

});

server.get('/finish', (req, res) => {
    try {
        const options = {
            destination: getRegisteredNumbers()[0] || '9084562367', 
            webhookURL: `${process.env.HOSTURL}/twilio/response/final`
        };

        initiateCall(options).catch((err) => { throw err; });
    } catch(err) {
        console.log(err);
    }
    res.end();
})

server.use('/twilio', twilioRoutes);


console.log('> Starting Server...')
server.listen(process.env.PORT, () => {
    console.log(`> Listening on port ${process.env.PORT}`)
});