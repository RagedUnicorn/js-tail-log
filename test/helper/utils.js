'use strict';

var fs = require('fs');

var options = require('../../lib/tail/options');

/**
 * reset global config file
 * @return {Object};
 */
function resetOptions() {
    var member;

    for (member in options) {
        if (options.hasOwnProperty(member)) {
            delete options[member];
        }
    }

    options.configName = '.jstail';
    options.colorActive = false;
    options.quiet = false;
    options.debug = false;
    options.config = null;
    options.logFile = null;
    options.setting = null;

    return options;
}

/**
 * make tmp dir if it does not exist
 */
function createTmpDir() {
    var stats;

    try {
        stats = fs.lstatSync('test/tmp');

        if (!stats.isDirectory()) {
            fs.mkdirSync('test/tmp');
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            fs.mkdirSync('test/tmp');
        }
    }
}

/**
 * write a config file to a tmp folder
 * @param {String} path
 * @param {Object} object
 */
function writeConfig(path, object) {
    createTmpDir();

    var filePath = path || 'test/tmp/config.json';

    try {
        var configFile = fs.openSync(filePath, 'w');
        var config = JSON.stringify(object);

        fs.writeSync(configFile, config, 0);
    } catch (e) {
        console.error(e);
    }
}

/**
 * write an invalid config (invalid json)
 * @param {String} path
 */
function writeInvalidConfig(path) {
    createTmpDir();

    var filePath = path || 'test/tmp/invalid-config.json';

    try {
        var configFile = fs.openSync(filePath, 'w');

        // invalid json - missing double quotes
        fs.writeSync(configFile, '{test: this is invalid json }', 0);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    resetOptions: resetOptions,
    writeConfig: writeConfig,
    writeInvalidConfig: writeInvalidConfig
};
