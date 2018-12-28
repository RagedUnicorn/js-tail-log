'use strict';

var options = require('./options');
var colors = require('./colors');
var out = require('./out');
var logger = require('../utils/logger');

/**
 * @param {Array} messages
 */
function match(messages) {
    var i, it;

    for (i = 0; i < messages.length; i++) {
        var foundMatch = false; // reset
        var patterns = options.config.patterns;

        // check every pattern
        for (it = 0; it < patterns.length; it++) {
            if (messages[i].search(new RegExp(patterns[it].expr)) !== -1) {
                out.printLine(colors.colorize(messages[i], patterns[it].name));
                foundMatch = true;
                break; // break on first match -> ignore additional matches
            }
        }

        // print without coloring
        if (!foundMatch) {
            logger.debug('match(): line did not match any pattern');
            out.printLine(messages[i]);
        }
    }
}

module.exports = {
    match: match
};
