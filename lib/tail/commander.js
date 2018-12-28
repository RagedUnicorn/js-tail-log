'use strict';

var program = require('commander');
var fs = require('fs');
var path = require('path');

var logger = require('../utils/logger');
var options = require('./options');

/**
 * check all options
 */
function checkOptions() {
    // note its important that debug is set as first one because debug is by default false
    if (program.debug) {
        options.debug = true;
        logger.debug('checkOptions(): activated debug mode');
    }

    if (program.color) {
        options.colorActive = false;
        logger.debug('checkOptions(): deactivated coloring');
    }

    if (program.quiet) {
        options.quiet = true;
        logger.debug('checkOptions(): set logMode to quiet');
    }

    if (program.setting) {
        options.setting = path.resolve(program.setting);
        logger.debug('checkOptions(): set custom config path \'' + options.setting + '\'');
    }
}

/**
 * check all parameters
 * 1. paramereter = expect type file(path)
 */
function checkParameters() {
    if (program.args[0]) {
        try {
            if (fs.statSync(program.args[0]).isFile()) {
                options.logFile = program.args[0];
            } else {
                logger.error('checkParameters(): expected a file');
                process.exit(1);
            }
        } catch (e) {
            logger.error('checkParameters(): ' + e.message);
            process.exit(1);
        }
    } else {
        logger.error('checkParameters(): expected a file');
        process.exit(1);
    }
}

module.exports = {
    checkParameters: checkParameters,
    checkOptions: checkOptions
};
