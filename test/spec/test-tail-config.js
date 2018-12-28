'use strict';

var options = require('../../lib/tail/options');
var config = require('../../lib/tail/config');
var defaults = require('../../lib/tail/defaults');
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

        // silence console.log
        console.log = function () {};

        callback();
    },
    tearDown: function (callback) {
        callback();
    },
    testDefaultConfig: function (test) {
        test.expect(1);
        test.deepEqual(options.config, defaults, 'expected config to be equal to defaults');
        test.done();
    },
    testCheckPrepareConfigs: function (test) {
        test.expect(1);

        options.configName = 'bar';
        options.config = config.prepareConfigs();

        // bar does not exist fall back to defaults
        test.deepEqual(options.config, defaults, 'expected config to be equal to defaults');
        test.done();
    },
    testCustomConfig: function (test) {
        test.expect(1);

        var path = 'test/tmp/config.json';
        var customConfig = {
            initLines: 20
        };

        // write a custom config
        util.writeConfig(path, customConfig);
        options.setting = path;

        options.configName = 'bar'; // set all other configs to unknown avoid side effects
        options.config = config.prepareConfigs();

        test.equal(options.config.initLines, 20, 'expected config to match passed config');
        test.done();
    },
    testMergeHomeConfig: function (test) {
        test.expect(1);

        var homeConfig = {
            initLines: 20
        };

        var curentDirectoryConfig = {},
            customConfig = {},
            finalConfig;

        // home config overwrites defaults
        finalConfig = config.mergeConfigs(homeConfig, curentDirectoryConfig, customConfig);
        test.deepEqual(finalConfig.initLines, 20, 'expected home config to overwrite defaults');
        test.done();
    },
    testMergeCurrentDirectoryConfig: function (test) {
        test.expect(1);

        var currentDirectoryConfig = {
            initLines: 20
        };

        var homeConfig = {},
            customConfig = {},
            finalConfig = {};

        // currentdirectory config overwrites defaults
        finalConfig = config.mergeConfigs(homeConfig, currentDirectoryConfig, customConfig);
        test.deepEqual(finalConfig.initLines, 20, 'expected currentDirectory config to overwrite defaults');

        test.done();
    },
    testMergeCustomConfig: function (test) {
        test.expect(1);

        var customConfig = {
            initLines: 20
        };

        var homeConfig = {},
            currentDirectoryConfig = {},
            finalConfig = {};

        // custom config overwrites defaults
        finalConfig = config.mergeConfigs(homeConfig, currentDirectoryConfig, customConfig);
        test.deepEqual(finalConfig.initLines, 20, 'expected custom config to overwrite defaults');

        test.done();
    },
    testMergeOrderCustom: function (test) {
        test.expect(1);

        var customConfig = {
            initLines: 1
        };

        var homeConfig = {
            initLines: 2
        };

        var currentDirectoryConfig = {
            initLines: 3
        };

        var finalConfig = {};

        // custom config takes precedence before everything
        finalConfig = config.mergeConfigs(homeConfig, currentDirectoryConfig, customConfig);
        test.deepEqual(finalConfig.initLines, 1, 'expected custom config to take precedence over other configs');

        test.done();
    },
    testMergeOrderCurrentDirectory: function (test) {
        test.expect(1);

        var customConfig = {},
            finalConfig = {};

        var homeConfig = {
            initLines: 1
        };

        var currentDirectoryConfig = {
            initLines: 2
        };

        // currentDirectory config takes precedence before home config
        finalConfig = config.mergeConfigs(homeConfig, currentDirectoryConfig, customConfig);
        test.deepEqual(finalConfig.initLines, 2,
            'expected currentDirectory config to take precedence over other home config');

        test.done();
    },
    testLoadConfigMissingParameter: function (test) {
        test.expect(1);

        var result = config.loadConfig();

        test.deepEqual(result, null, 'expected return value null');
        test.done();
    },
    testLoadConfigInvalidParameter: function (test) {
        test.expect(1);

        var result = config.loadConfig({});

        test.deepEqual(result, null, 'expected return value null');
        test.done();
    },
    testLoadConfigNonExistingFile: function (test) {
        test.expect(1);

        test.doesNotThrow(
            function () {
                config.loadConfig('non-existing-file');
            },
            function (err) {
                if ((err instanceof Error) && /ENOENT, no such file or directory/.test(err)) {
                    return true;
                }
            },
            'unexpected error'
        );
        test.done();
    },
    testLoadInvalidConfig: function (test) {
        test.expect(1);

        var path = 'test/tmp/invalid-config.json';

        util.writeInvalidConfig(path);

        test.throws(
            function () {
                config.loadConfig(path);
            },
            function (err) {
                if ((err instanceof Error) && /failed to parse config$/.test(err)) {
                    return true;
                }
            },
            'unexpected or missing error'
        );

        test.done();
    },
    testLoadConfig: function (test) {
        test.expect(1);

        var path = 'test/tmp/config.json',
            finalConfig;
        var customConfig = {
            initLines: 30
        };

        // write a custom config
        util.writeConfig(path, customConfig);
        finalConfig = config.loadConfig(path);
        test.equal(finalConfig.initLines, 30, 'expected custom config to be loaded');
        test.done();
    }
};
