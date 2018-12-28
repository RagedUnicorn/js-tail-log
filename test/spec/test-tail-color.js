'use strict';

var colors = require('../../lib/tail/colors');
var options = require('../../lib/tail/options');
var config = require('../../lib/tail/config');
var util = require('../helper/utils');

module.exports = {
    setUp: function (callback) {
        options = util.resetOptions();

        var me = this;

        options.configName = 'foo'; // change configName to avoid using the .jstail config in the current directory
        options.config = config.prepareConfigs();

        me.value = '';
        me.preservedConsoleLog = console.log;
        // silence console.log
        console.log = function (str) {
            me.value = str;
        };

        callback();
    },
    tearDown: function (callback) {
        console.log = this.preservedConsoleLog;
        callback();
    },
    testColorize: function (test) {
        test.expect(1);

        var type = 'debug';
        var message = 'foo message';

        // activate color
        options.colorActive = true;
        message = colors.colorize(message, type);

        test.equal(message, '\u001b[35mfoo message\u001b[0m', 'expected strings to be equal');

        test.done();
    },
    testNoColor: function (test) {
        test.expect(1);

        var type = 'debug';
        var message = 'foo message';

        // deactivate color
        options.colorActive = false;
        message = colors.colorize(message, type);

        test.equal(message, 'foo message', 'expected strings to be equal');

        test.done();
    },
    testMissingParameter: function (test) {
        test.expect(1);

        options.quiet = true;

        var message = colors.colorize();

        test.deepEqual(message, false, 'expected a falsy value');

        test.done();
    },
    testUnkownType: function (test) {
        test.expect(1);

        options.quiet = true;

        var type = 'unkown';
        var message = colors.colorize('foo message', type);

        test.deepEqual(message, false, 'expected a falsy value');
        test.done();
    }
};
