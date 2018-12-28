'use strict';

var options = require('./options');
var logger = require('../utils/logger');

// save lines that are unfinished
var brokenLine = [];
// normalize lines regexp
var normalizeRegex = /(?:\r\n|\r)+/g;
var multiLineRegex = /^(\t{1,}|\s{2,}).*$/m;

function checkForMultiLine(line, lines) {
    if (multiLineRegex.test(line)) {
        // pop last element added to lines
        var previousLine = lines.pop();

        // and append message
        previousLine += line;

        lines.push(previousLine);

        return true;
    }
    return false;
}

/**
 * @param {String} changeData
 * @returns {Array} lines
 *              returns an array with all completed lines
 */
function read(changeData) {
    var input, lines = [], line = [], i;
    var isMultiLine = false;

    changeData = changeData.replace(normalizeRegex, '\n'); // normalize lineendings
    input = changeData.split('');

    for (i = 0; i < input.length; i++) {
        var character = input[i];

        if (brokenLine.length) {
            line = brokenLine.slice(0); // clone array
            brokenLine.length = 0;
        }

        if (character === '\n') {
            line.push(character); // include end of line

            isMultiLine = checkForMultiLine(line.join(''), lines);

            if (!isMultiLine) {
                lines.push(line.join(''));
            }
            line.length = 0;
        } else {
            // push current character to line
            line.push(character);
        }
    }

    /**
     * if line is not zero we still have characters left in the array without a newline character at the end
     * preserve this line as brokenLine and put it together with the next change.event
     */
    if (line.length !== 0) {
        logger.debug('read(): reached end of changedata with a broken line');
        brokenLine.push(line.join(''));
        line.length = 0;
    }

    return lines;
}

/**
 *
 * @param {String} data
 * @return {Array}
 *          array of n collected lines
 */
function readBackwards(data) {
    var lines = [], line = [], i;

    data = data.replace(normalizeRegex, '\n'); // normalize lineendings

    for (i = data.length - 1; i >= 0; i--) {
        if (data[i] === '\n') {
            if (line.length) {
                lines.push(line.join(''));

                line.length = 0;
            }

            if (lines.length === options.config.initLines) {
                return lines;
            }

            // beginning of a line
            line.push(data[i]);
        } else {
            line.unshift(data[i]);
        }
    }

    // count of lines is < lines in config push last line
    if (line.length) {
        lines.push(line.join(''));
    }

    return lines;
}

/**
 * resets the brokenLine array
 */
function clearBrokenLine() {
    brokenLine.length = 0;
}

module.exports = {
    read: read,
    clearBrokenLine: clearBrokenLine,
    readBackwards: readBackwards
};
