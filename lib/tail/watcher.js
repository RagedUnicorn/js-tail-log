'use strict';

var fs = require('fs');

var matcher = require('./matcher');
var reader = require('./reader');
var logger = require('../utils/logger');

var currentFileSize;

/**
 * get initial size of the file
 * Used to determine at which point we need to start reading when the file changes
 * @param {String} file
 */
function setInitialFileSize(file) {
    currentFileSize = fs.statSync(file).size;
}

/**
 * check if the file was reset
 * @param {Object} stats
 * @return {Boolean} true if filereset else false
 */
function isFileReset(stats) {
    if (currentFileSize > stats.size) {
        currentFileSize = stats.size;
        return true;
    }
    return false;
}

/**
 * watch a files for changes and pass those changes to the matcher
 * @param {String} file
 */
function watch(file) {
    var stats, stream, messages;

    setInitialFileSize(file);

    fs.watchFile(file, { persistent: true, interval: 100}, function () {
        try {
            stats = fs.statSync(file);
        } catch (exception) {
            logger.error(exception.message);
            process.exit(1);
        }

        if (isFileReset(stats)) {
            return;
        }

        stream = fs.createReadStream(file, {
            flags: 'r',
            encoding: 'utf-8',
            start: currentFileSize,
            end: stats.size
        });

        stream.on('error', function (err) {
            logger.error('watcher(): ' + err);
        });

        stream.on('data', function (data) {
            messages = reader.read(data);
            matcher.match(messages);
            currentFileSize = stats.size;
        });
    });
}

module.exports = {
    watch: watch
};
