'use strict';

// default values and configuration
var defaults = {
    initLines: 10, // initial lines that are printed
    colorNeutral: '\u001b[0m',
    patterns: [ // default patterns for colorizing
        {
            name: 'debug',
            expr: '(DEBUG)',
            color: '\u001b[35m' // magenta
        }, {
            name: 'info',
            expr: '(INFO)',
            color: '\u001b[36m' // cyan
        }, {
            name: 'warn',
            expr: '(WARN)',
            color: '\u001b[33m' // yellow
        }, {
            name: 'error',
            expr: '(ERROR)',
            color: '\u001b[31m' // red
        }
    ]
};

module.exports = defaults;
