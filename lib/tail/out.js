'use strict';

/**
 * @param {String} text
 */
function printLine(text) {
    process.stdout.write(text);
}

module.exports = {
    printLine: printLine
};
