'use strict';

var logger = require('../utils/logger');
var options = require('./options');

/**
 * colorize lines
 * @param {String} line
 *              the text to color
 * @param {String} type
 *              the type of the message e.g. DEBUG
 * @return {Boolean|String} the passed line or false if the type was not found
 */
function colorize(line, type) {
    var patterns = options.config.patterns,
        typeFound = false,
        i;

    for (i = 0; i < patterns.length; i++) {
        if (type === patterns[i].name) {
            typeFound = true;
            if (!options.colorActive) {
                return line;
            } else {
                return patterns[i].color + line + options.config.colorNeutral;
            }

            break;
        }
    }

    if (!typeFound) {
        // error type not found print message uncolorized
        logger.error('colorize(): error type \'' + type + '\' not found');
        return false;
    }
}

module.exports = {
    colorize: colorize
};
