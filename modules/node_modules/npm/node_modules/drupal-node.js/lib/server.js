/*
* Submodule for setting up the server.
*/
'use strict';

var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var Routes = require('./routes');
var Backend = require('./backend');
var ClientManager = require('./client-manager');

var server = {};

/**
 * Starts the server.
 */
server.start = function (configManager) {
  var settings = configManager.getSettings();
  var app = express();

  var backend = new Backend(settings);
  var clientManager = new ClientManager(settings, backend);
  var routes = new Routes();

  // Allow extensions to  override route callbacks.
  configManager.invokeExtensions('alterRoutes', routes);

  app.use(bodyParser.json({}));

  app.use(function (request, response, next) {
    // Make objects available to route callbacks.
    // (Needed because route callbacks cannot access properties via the 'this' keyword.)
    request.clientManager = clientManager;
    next();
  });

  app.all(settings.baseAuthPath + '*', routes.checkServiceKey);
  app.post(settings.baseAuthPath + 'publish', routes.publishMessage);
  app.post(settings.baseAuthPath + 'user/kick/:uid', routes.kickUser);
  app.post(settings.baseAuthPath + 'user/logout/:authtoken', routes.logoutUser);
  app.post(settings.baseAuthPath + 'user/channel/add/:channel/:uid', routes.addUserToChannel);
  app.post(settings.baseAuthPath + 'user/channel/remove/:channel/:uid', routes.removeUserFromChannel);
  app.post(settings.baseAuthPath + 'channel/add/:channel', routes.addChannel);
  app.get(settings.baseAuthPath + 'health/check', routes.healthCheck);
  app.get(settings.baseAuthPath + 'channel/check/:channel', routes.checkChannel);
  app.post(settings.baseAuthPath + 'channel/remove/:channel', routes.removeChannel);
  app.get(settings.baseAuthPath + 'user/presence-list/:uid/:uidList', routes.setUserPresenceList);
  app.post(settings.baseAuthPath + 'debug/toggle', routes.toggleDebug);
  app.post(settings.baseAuthPath + 'content/token/users', routes.getContentTokenUsers);
  app.post(settings.baseAuthPath + 'content/token', routes.setContentToken);
  app.post(settings.baseAuthPath + 'content/token/message', routes.publishMessageToContentChannel);
  app.post(settings.baseAuthPath + 'authtoken/channel/add/:channel/:authToken', routes.addAuthTokenToChannel);
  app.post(settings.baseAuthPath + 'authtoken/channel/remove/:channel/:authToken', routes.removeAuthTokenFromChannel);

  // Allow extensions to add routes.
  var extensionRoutes = configManager.getExtensionRoutes();
  extensionRoutes.forEach(function (route) {
    if (route.type == 'post') {
      app.post(route.path, route.handler);
    }
    else {
      app.get(route.path, route.handler);
    }
  });
  
  app.get('*', routes.send404);

  var httpServer;
  if (settings.scheme == 'https') {
    var sslOptions = {
      key: fs.readFileSync(settings.sslKeyPath),
      cert: fs.readFileSync(settings.sslCertPath)
    };
    if (settings.sslCAPath) {
      sslOptions.ca = fs.readFileSync(settings.sslCAPath);
    }
    if (settings.sslPassPhrase) {
      sslOptions.passphrase = settings.sslPassPhrase;
    }
    httpServer = https.createServer(sslOptions, app);
  }
  else {
    httpServer = http.createServer(app);
  }

  httpServer.listen(settings.port, settings.host);
  console.log('Started ' + settings.scheme + ' server.');

  var io = require('socket.io')(httpServer, settings.socketOptions);

  io.on('connection', function(socket) {
      clientManager.addSocket(socket);
    })
    .on('error', function(exception) {
      console.log('Socket error [' + exception + ']');
    });

  // The extensions will have access to all connection data via the clientManager object. They can also access
  // .settings and .backend via the clientManager.
  configManager.invokeExtensions('setup', clientManager);
};

module.exports = server;
