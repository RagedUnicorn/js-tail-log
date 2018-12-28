'use strict';

var options = require('../../lib/tail/options');
var config = require('../../lib/tail/config');
var reader = require('../../lib/tail/reader');
var util = require('../helper/utils');

module.exports = {
    setUp: function (callback) {
        options = util.resetOptions();

        var me = this;

        options.configName = 'foo'; // change configName to avoid using the .jstail config in the current directory
        options.config = config.prepareConfigs();
        options.debug = false;
        options.colorActive = true;

        me.normalize = /(?:\r\n|\r)+/g;

        me.value = '';
        me.preservedConsoleLog = process.stdout.write;

        // overwrite console log so we can spy on it
        console.log = function (str) {
            me.value = str;
        };

        // make sure to clear brokeLine in reader avoid side-effects from other tests
        reader.clearBrokenLine();

        callback();
    },
    tearDown: function (callback) {
        process.stdout.write = this.preservedConsoleLog;
        callback();
    },
    testReadBackwardsNewline: function (test) {
        test.expect(4);

        var messages = [], result, type;

        options.config.initLines = 2;

        messages = [
            '[DEBUG] this is a debug message\n',
            '[ERROR] this is an error message\n',
            '[WARN] this is a warn message\n'
        ];

        result = reader.readBackwards(messages.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected a result type of [object Array]');
        test.equal(2, result.length, 'expected result length to be 2');
        test.equal(messages[1], result[result.length - 1], 'expected lines to be equal'); // line 1
        test.equal(messages[2], result[result.length - 2], 'expected lines to be equal'); // line 2

        test.done();
    },
    testReadBackwardsCarriageReturn: function (test) {
        test.expect(4);

        var messages = [], result, type;

        options.config.initLines = 2;

        messages = [
            '[DEBUG] this is a debug message\r\n',
            '[ERROR] this is an error message\r\n',
            '[WARN] this is a warn message\r\n'
        ];

        result = reader.readBackwards(messages.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected a result type of [object Array]');
        test.equal(2, result.length, 'expected result length to be 2');
        test.equal(messages[1].replace(this.normalize, '\n'), result[result.length - 1],
            'expected lines to be equal'); // line 1
        test.equal(messages[2].replace(this.normalize, '\n'), result[result.length - 2],
            'expected lines to be equal'); // line 2

        test.done();
    },
    /**
     * Newline test \n
     * Carriage return test \r\n
     */
    testNormalLinesNewline: function (test) {
        test.expect(2);

        var output, type;

        var message1 = '[ERROR]: this is an error message\n';
        var message2 = '[INFO]: this is an info message\n';
        var changeData = message1 + message2;
        var expectedArray = [];

        expectedArray.push(message1);
        expectedArray.push(message2);


        output = reader.read(changeData);
        type = Object.prototype.toString.call(output);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected arrays to be equal');
        test.done();
    },
    testNormalLinesCarriageReturn: function (test) {
        test.expect(2);

        var output, type;

        var message1 = '[ERROR]: this is an error message\r\n';
        var message2 = '[INFO]: this is an info message\r\n';
        var changeData = message1 + message2;
        var expectedArray = [];

        expectedArray.push(message1.replace(this.normalize, '\n'));
        expectedArray.push(message2.replace(this.normalize, '\n'));


        output = reader.read(changeData);
        type = Object.prototype.toString.call(output);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected arrays to be equal');

        test.done();
    },
    testBrokenLineNewline: function (test) {
        test.expect(2);

        var output, type;

        var message1 = '[ERROR]: this is an error message\n';
        // unfinished line because of no newline
        var message2 = '[INFO]: this is an info message';

        var changeData = message1 + message2;
        var expectedArray = [];
        // message2 will be held as brokenLine and not returned yet
        expectedArray.push(message1);

        output = reader.read(changeData);
        type = Object.prototype.toString.call(output);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected arrays to be equal');

        test.done();
    },
    testBrokenLineCarriageReturn: function (test) {
        test.expect(2);

        var output, type;

        var message1 = '[ERROR]: this is an error message\r\n';
        // unfinished line because of no newline
        var message2 = '[INFO]: this is an info message';

        var changeData = message1 + message2;
        var expectedArray = [];

        // message2 will be held as brokenLine and not returned yet
        expectedArray.push(message1.replace(this.normalize, '\n'));

        output = reader.read(changeData);
        type = Object.prototype.toString.call(output);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected arrays to be equal');

        test.done();
    },
    testConnectBrokenLineNewline: function (test) {
        test.expect(4);

        var output, type;

        var message1 = '[ERROR]: this is an error message\n';
        // unfinished line because of no newline
        var message2 = '[INFO]: this is an info message';
        var message3 = ' end of line\n';

        var changeData = message1 + message2;
        var expectedArray = [];

        // message2 will be held as brokenLine and not returned yet
        expectedArray.push(message1);

        output = reader.read(changeData);
        type = Object.prototype.toString.call(output);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected arrays to be equal');


        expectedArray.length = 0;
        expectedArray.push(message2 + message3);
        output.length = 0;

        output = reader.read(message3);

        test.equal(type, '[object Array]', 'Expected output to be of type array');
        test.deepEqual(output, expectedArray, 'Expected output to match connected brokenLine');

        test.done();
    },
    testConnectBrokenLineCarriageReturn: function (test) {
        test.done();
    }
};
