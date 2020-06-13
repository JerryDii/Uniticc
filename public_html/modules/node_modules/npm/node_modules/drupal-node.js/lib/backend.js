/**
 * Submodule for handling communication with the backend.
 */
'use strict';

var request = require('request');
var querystring = require('querystring');
var url = require('url');
var Utility = require('./utility');

/**
 * Constructor.
 */
function Backend(settings) {
  this.settings = settings;

  this.logger = new Utility.Logger(this.settings);
}

/**
 * Check a service key against the configured service key.
 */
Backend.prototype.checkServiceKey = function (serviceKey) {
  if (this.settings.serviceKey && serviceKey != this.settings.serviceKey) {
    this.logger.log('checkServiceKey: Invalid service key ' + serviceKey + ', expecting ' + this.settings.serviceKey);
    return false;
  }
  return true;
};

/**
 * Returns the backend url.
 */
Backend.prototype.getBackendUrl = function () {
  return url.format({
    protocol: this.settings.backend.scheme,
    hostname: this.settings.backend.host,
    port: this.settings.backend.port,
    pathname: this.settings.backend.basePath + this.settings.backend.messagePath
  });
};

/**
 * Returns the header for backend requests.
 */
Backend.prototype.getAuthHeader = function() {
  if (this.settings.backend.httpAuth.length > 0) {
    return 'Basic ' + new Buffer(this.settings.backend.httpAuth).toString('base64');
  }
  return false;
};

/**
 * Send a message to the backend.
 */
Backend.prototype.sendMessageToBackend = function (message, callback) {
  var requestBody = querystring.stringify({
    messageJson: JSON.stringify(message),
    serviceKey: this.settings.serviceKey
  });

  var options = {
    uri: this.getBackendUrl(),
    body: requestBody,
    headers: {
      'Content-Length': Buffer.byteLength(requestBody),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  if (this.settings.backend.scheme == 'https') {
    options.strictSSL = this.settings.backend.strictSSL;
  }

  var httpAuthHeader = this.getAuthHeader();
  if (httpAuthHeader !== false) {
    options.headers.Authorization = httpAuthHeader;
  }

  this.logger.debug("Sending message to backend");
  this.logger.debug("message", message);
  this.logger.debug("options", options);

  request.post(options, callback);
};

module.exports = Backend;
