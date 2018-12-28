'use strict';

var path = require('path');
var fs = require('fs');

var utils = require('../utils/utils');
var logger = require('../utils/logger');
var options = require('./options');
var defaults = require('./defaults');

/**
 * loads a config
 * @param {String} configPath
 *              path to a config file
 * @return {Object|null} returns a config object or null if something goes wrong
 */
function loadConfig(configPath) {
    var config,
        data;

    if (!configPath || typeof configPath !== 'string') {
        return null;
    }

    logger.debug('loadConfig(): loading config in ' + configPath);

    try {
        data = fs.readFileSync(configPath, 'utf8');
        config = JSON.parse(data);

        if (config) {
            logger.debug('loadConfig(): config loaded: ');
            logger.debug(JSON.stringify(config, null, 4));
        } else {
            logger.log('loadConfig(): no config found in ' + configPath);
            return null;
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            // files are optional
            logger.debug('loadConfig(): ' + configPath + ' not found');
            return null;
        }
        throw new Error('loadConfig(): failed to parse config');
    }

    return config;
}

/**
 * the configs are merged together in the following order
 * -s|--setting param > current directory > homefolder directory > fallback to default
 * @param {Object} defaults
 * @param {Object} homeConfig
 * @param {Object} currentDirectoryConfig
 * @param {Object} customConfig
 * @return {Object}
 *          merged config object
 */
function mergeConfigs(homeConfig, currentDirectoryConfig, customConfig) {
    return utils.merge(defaults, homeConfig, currentDirectoryConfig, customConfig);
}

/**
 * generate a config based on defaults, homeconfig, currentdirconfig and settings config
 * @return {Object}
 *              final config
 */
function prepareConfigs() {
    var homeConfigPath = path.join(utils.getUserHome(), options.configName);
    var currentDirectoryConfigPath = path.join(process.cwd(), options.configName);
    var customConfigPath = options.setting;
    var homeConfig, currentDirectoryConfig, customConfig, config;

    homeConfig = loadConfig(homeConfigPath);
    currentDirectoryConfig = loadConfig(currentDirectoryConfigPath);
    customConfig = loadConfig(customConfigPath);

    config = mergeConfigs(homeConfig, currentDirectoryConfig, customConfig);
    logger.debug('prepareConfigs(): final config ' + JSON.stringify(config, null, 4));

    return config;
}

module.exports = {
    prepareConfigs: prepareConfigs,
    mergeConfigs: mergeConfigs,
    loadConfig: loadConfig
};
