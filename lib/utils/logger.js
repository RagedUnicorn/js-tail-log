'use strict';

var options = require('../tail/options');

/**
 * prints to console if not explicitly suppresed
 * @param {String} text
 */
function log(text) {
    if (!options.quiet) {
        console.log('[LOG]: ' + text);
    }
}

/**
 * prints to console if not explicitly suppresed
 * @param {String} text
 */
function error(text) {
    if (!options.quiet) {
        console.log('[ERROR]: ' + text);
    }
}

/**
 * prints to console if debug mode is active
 * @param {String} text
 */
function debug(text) {
    if (options.debug) {
        console.log('[DEBUG]: ' + text);
    }
}

module.exports = {
    log: log,
    debug: debug,
    error: error
};
