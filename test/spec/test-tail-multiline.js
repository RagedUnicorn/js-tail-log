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
        options.debug = false;
        options.config = config.prepareConfigs();
        options.colorActive = true;
        options.quiet = true;

        me.value = '';
        me.preservedConsoleLog = process.stdout.write;

        process.stdout.write = function (str) {
            me.value = str;
        };

        // silence console.log
        console.log = function () {};

        callback();
    },
    tearDown: function (callback) {
        process.stdout.write = this.preservedConsoleLog;
        callback();
    },
    testMinimumTabMultiLineColored: function (test) {
        test.expect(2);

        var result, type;
        var changeData = [
            '[ERROR]: this is an error message ',
            '\tthat reaches over multiple lines\n', // minimum for multiLine is 1 tab
            '[DEBUG]: this is a debug message\n'
        ];

        var expected = [];

        expected.push(changeData[0] + changeData[1]);
        expected.push(changeData[2]);

        result = reader.read(changeData.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected result to be of type array');
        test.deepEqual(result, expected, 'expected arrays to be equal');

        test.done();
    },
    testMinimumSpaceMultiLineColored: function (test) {
        test.expect(2);

        var result, type;
        var changeData = [
            '[ERROR]: this is an error message ',
            '  that reaches over multiple lines\n', // minimum for multiLine is 2 spaces
            '[DEBUG]: this is a debug message\n'
        ];

        var expected = [];

        expected.push(changeData[0] + changeData[1]);
        expected.push(changeData[2]);

        result = reader.read(changeData.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected result to be of type array');
        test.deepEqual(result, expected, 'expected arrays to be equal');

        test.done();
    },
    testTabMultiLineColored: function (test) {
        test.expect(2);

        var result, type;
        var changeData = [
            '[ERROR]: this is an error message ',
            '\t\t\tthat reaches over multiple lines\n', // multiple tabs allowed
            '[DEBUG]: this is a debug message\n'
        ];

        var expected = [];

        expected.push(changeData[0] + changeData[1]);
        expected.push(changeData[2]);

        result = reader.read(changeData.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected result to be of type array');
        test.deepEqual(result, expected, 'expected arrays to be equal');

        test.done();
    },
    testSpaceMultiLineColored: function (test) {
        test.expect(2);

        var result, type;
        var changeData = [
            '[ERROR]: this is an error message ',
            '      that reaches over multiple lines\n', // multiple spaces allowed
            '[DEBUG]: this is a debug message\n'
        ];

        var expected = [];

        expected.push(changeData[0] + changeData[1]);
        expected.push(changeData[2]);

        result = reader.read(changeData.join(''));
        type = Object.prototype.toString.call(result);

        test.equal(type, '[object Array]', 'expected result to be of type array');
        test.deepEqual(result, expected, 'expected arrays to be equal');

        test.done();
    },
};
