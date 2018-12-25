'use strict';

const textMessages = require('./trivia.json');

exports.textGet = function textGet(string = '', delimeter = ':') {
    const [section, id] = string.split(delimeter);
    console.log('Parsing %s with id %s', section, id)
    return textMessages[section][id];
}


const registry = [];

exports.getRegisteredNumbers = function getRegisteredNumbers() {
    return registry;
}

exports.registerNumber = function registerNumber(number) {
    registry.push(number);
}

exports.clearRegistry = function clearRegistry() {
    registry = [];
}


