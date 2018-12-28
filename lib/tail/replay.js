'use strict';

var fs = require('fs');
var program = require('commander');

var reader = require('./reader');
var matcher = require('./matcher');
var logger = require('../utils/logger');

function replay() {
    var EOF = false,
        fileData = '',
        stream;

    stream = fs.createReadStream(program.args[0], {
        flags: 'r',
        encoding: 'utf-8'
    });

    stream.on('data', function (data) {
        fileData += data;

        var readData = reader.read(fileData),
            i = 0,
            interval;

        interval = setInterval(function () {
            if (readData[i] === undefined) {
                clearInterval(interval);

                if (EOF) {
                    // exit on eof but only when all messages are printed
                    process.exit(0);
                }

                return;
            }

            matcher.match([].concat(readData[i]));

            i++;
        }, program.replay || 1000);
    });

    // reached end of logfile
    stream.on('end', function () {
        logger.debug('replay(): reached end of logfile exiting after log messages are written');
        EOF = true;
    });
}

module.exports = {
    replay: replay
};
