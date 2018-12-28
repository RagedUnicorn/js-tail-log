#!/usr/bin/env node
'use strict';

var program = require('commander');
var fs = require('fs');

var pkg = require('../package.json');
var commander = require('./tail/commander');
var options = require('./tail/options');
var config = require('./tail/config');
var watcher = require('./tail/watcher');
var matcher = require('./tail/matcher');
var reader = require('./tail/reader');
var replay = require('./tail/replay');
var logger = require('./utils/logger');

// parameter handling
program
    .usage('<file ...> [options]')
    .version(pkg.version)
    .option('-s, --setting <config>', 'Pass a custom config [path]')
    .option('-c, --color ', 'Activate colored output')
    .option('-q, --quiet', 'Suppress all errors')
    .option('-d, --debug', 'Show debug messages. Default is false')
    .option('-r, --replay [interval]', 'Replay a log with a certain delay')
    .parse(process.argv);

/**
 * initialy open the logfile and print the last 'n' lines
 * @param {String} file
 */
function readInitial(file) {
    var fileData = '',
        stream;

    stream = fs.createReadStream(file, {
        flags: 'r',
        encoding: 'utf-8'
    });

    stream.on('data', function (data) {
        fileData += data;
    });

    stream.on('error', function (err) {
        logger.error('readInitial(): ' + err);
    });

    stream.on('end', function () {
        var lines = reader.readBackwards(fileData);
        lines = reader.read(lines.reverse().join(''));

        matcher.match(lines);
    });
}

function init() {
    commander.checkOptions();
    commander.checkParameters();
    options.config = config.prepareConfigs();

    if (program.replay) {
        replay.replay();
        return; // stop all other actions
    }

    readInitial(options.logFile);
    watcher.watch(options.logFile);
}

init();
