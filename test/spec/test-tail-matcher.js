'use strict';

var options = require('../../lib/tail/options');
var config = require('../../lib/tail/config');
var matcher = require('../../lib/tail/matcher');
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

        me.eol = '\n';
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
    testMatchDefaultDebug: function (test) {
        test.expect(1);

        var debugMessage = '[DEBUG] this is a debug message' +  this.eol;

        matcher.match(debugMessage.split()); // to array

        test.equal(this.value, '\u001b[35m' + debugMessage + '\u001b[0m', 'expected messages to be equal');

        test.done();
    },
    testMatchDefaultError: function (test) {
        test.expect(1);

        var errorMessage = '[ERROR] this is an error message' + this.eol;

        matcher.match(errorMessage.split()); // to array
        test.equal(this.value, '\u001b[31m' + errorMessage + '\u001b[0m', 'expected messages to be equal');

        test.done();
    },
    testMatchDefaultWarn: function (test) {
        test.expect(1);

        var warnMessage = '[WARN] this is a warn message' + this.eol;

        matcher.match(warnMessage.split()); // to array
        test.equal(this.value, '\u001b[33m' + warnMessage + '\u001b[0m', 'expected messages to be equal');

        test.done();
    },
    testMatchDefaultInfo: function (test) {
        test.expect(1);

        var infoMessage = '[INFO] this is an info message' + this.eol;

        matcher.match(infoMessage.split()); // to array
        test.equal(this.value, '\u001b[36m' + infoMessage + '\u001b[0m', 'expected messages to be equal');

        test.done();
    },
    testNoMatch: function (test) {
        test.expect(1);

        var message = 'foo' + this.eol;

        matcher.match(message.split());
        test.equal(this.value, message, 'expected messages to be equal');
        test.done();
    },
    testMatchColor: function (test) {
        test.expect(2);

        var infoMessage = '[INFO] this is an info message' + this.eol;

        options.colorActive = false;
        matcher.match(infoMessage.split());
        test.equal(this.value, infoMessage);
        options.colorActive = true;
        matcher.match(infoMessage.split());
        test.equal(this.value, '\u001b[36m' + infoMessage + '\u001b[0m', 'expected messages to be equal');

        test.done();
    },
    testMultipleMatches: function (test) {
        test.expect(1);

        var path = 'test/tmp/custom-config.json';
        var message = 'this is a test message' + this.eol;

        var customConfig = {
            patterns: [
                {
                    name: 'foo',
                    expr: '(test)',
                    color: '\u001b[35m' // magenta
                }, {
                    name: 'bar',
                    expr: '(test)',
                    color: '\u001b[35m' // magenta
                }
            ]
        };

        util.writeConfig(path, customConfig);
        options.configName = 'foo';
        options.setting = path;
        options.debug = true;
        options.quiet = false;
        options.config = config.prepareConfigs();

        // single match
        matcher.match(message.split());
        test.equal(this.value, '\u001b[35m' + message + '\u001b[0m', 'expected messages to be equal');
        test.done();
    }
};
