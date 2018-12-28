#!/usr/bin/env node
'use strict';

var fs = require('fs');
var program = require('commander');

var pkg = require('../package.json');

var messages = [
    '[INFO]: this is an info message\n',
    '[DEBUG]: this is a debug message\n',
    '[WARN]: this is a warn message\n',
    '[ERROR]: this is an error message\n'
];

var multilineMessages = [
    '[INFO]: this is an info message\n    which continues on a next line\n',
    '[DEBUG]: this is a debug message\n    which continues on a next line\n',
    '[WARN]: this is a warn message\n    which continues on a next line\n',
    '[ERROR]: this is an error message \n    which continues on a next line\n'
];

var INVALID_ARGUMENT = 1;
var WRITE_STREAM_ERROR = 2;
var CREATESTREAM_ERROR = 3;

// parameter handling
program
    .usage('[options] <file ...>')
    .version(pkg.version)
    .option('-i, --interval <n>', 'set a custom interval default is 1000ms', parseInt)
    .option('-m, --multiline', 'print multilines instead of normal messages')
    .option('-r --random', 'print random messages using both normal and multiline messages')
    .option('-n --normal', 'print normal messages (used by default')
    .parse(process.argv);

/**
 * open file as stream. If the file does not exist it will be created
 * @param {String} file
 * @return {Object} a stream
 */
function openFile(file) {
    var stream;

    stream = fs.createWriteStream(file, {
        flags: 'a',
        encoding: 'utf-8',
    });

    stream.on('error', function (err) {
        console.error('stream write error', err);
        process.exit(WRITE_STREAM_ERROR);
    });

    return stream;
}

function writeNormalRandom(stream) {
    var rand = Math.round((Math.random() * 3));

    stream[0].write(messages[rand]);
    console.log(messages[rand].replace('\n', ''));
}

function writeMultilineRandom(stream) {
    var rand = Math.round((Math.random() * 3)),
        pos;

    stream[0].write(multilineMessages[rand]);

    pos = multilineMessages[rand].lastIndexOf('\n');
    console.log(multilineMessages[rand].substring(0, pos) + '' + multilineMessages[rand].substring(pos + 1));
}

function writeRandom(stream) {
    var rand = Math.round((Math.random() * 2));

    if (rand === 1) {
        writeNormalRandom(stream);
    } else {
        writeMultilineRandom(stream);
    }
}

/**
 * @param {Object} stream
 */
function interval(stream) {
    if (program.multiline && program.normal || program.random) {
        setInterval(writeRandom, program.interval || 1000, [stream]);
    } else if (program.multiline) {
        setInterval(writeMultilineRandom, program.interval || 1000, [stream]);
    } else {
        setInterval(writeNormalRandom, program.interval || 1000, [stream]);
    }
}

/**
 * init
 */
function init() {
    var stream;

    if (program.args.length < 1) {
        console.error('Invalid command line usage missing a file to write to');
        process.exit(INVALID_ARGUMENT);
    }

    stream = openFile(program.args[0]);

    if (!stream) {
        console.error('failed to create a writestream');
        process.exit(CREATESTREAM_ERROR);
    }

    interval(stream);
}

init();
