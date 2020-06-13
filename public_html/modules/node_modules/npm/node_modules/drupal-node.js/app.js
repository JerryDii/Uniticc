/**
 * Node.js Integration for Drupal
 * https://www.drupal.org/project/nodejs
 */
'use strict';

var server = require('./lib/server');
var configManager = require('./lib/config-manager');
var packageInfo = require('./package.json');
var configFile = process.argv[2] ? process.argv[2] : process.cwd() + '/nodejs.config.js';

global.version = packageInfo.version;

configManager.readFromDisk(configFile);
server.start(configManager);
