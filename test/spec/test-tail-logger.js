'use strict';

var options = require('../../lib/tail/options');
var config = require('../../lib/tail/config');
var logger = require('../../lib/utils/logger');
var util = require('../helper/utils');

module.exports = {
    setUp: function (callback) {
        options = util.resetOptions();

        var me = this;

        options.configName = 'foo'; // change configName to avoid using the .jstail config in the current directory
        options.config = config.prepareConfigs();
        options.debug = false;

        me.value = '';
        me.preservedConsoleLog = console.log;

        // overwrite console log so we can spy on it
        console.log = function (str) {
            me.value = str;
        };

        callback();
    },
    tearDown: function (callback) {
        console.log = this.preservedConsoleLog;
        callback();
    },
    testQuietLogFalse: function (test) {
        test.expect(1);

        options.quiet = false;

        logger.log('foo');

        test.equal(this.value, '[LOG]: foo', 'expected messages to be equal');
        test.done();
    },
    testQuietLogTrue: function (test) {
        test.expect(1);

        options.quiet = true;

        logger.log('foo');

        test.equal(this.value, '', 'expected message to be empty'); // should not log
        test.done();
    },
    testQuietErrorFalse: function (test) {
        test.expect(1);

        options.quiet = true;

        logger.error('foo');

        test.equal(this.value, '', 'expected message to be empty'); // should not log
        test.done();
    },
    testQuietErrorTrue: function (test) {
        test.expect(1);

        options.quiet = false;

        logger.error('foo');

        test.equal(this.value, '[ERROR]: foo', 'expected messages to be equal');
        test.done();
    },
    testDebugFalse: function (test) {
        test.expect(1);

        options.debug = false;

        logger.debug('foo');

        test.equal(this.value, '', 'expected message to be empty'); // should not log
        test.done();
    },
    testDebugTrue: function (test) {
        test.expect(1);

        options.debug = true;

        logger.debug('foo');

        test.equal(this.value, '[DEBUG]: foo', 'expected messages to be equal');
        test.done();
    }
};
