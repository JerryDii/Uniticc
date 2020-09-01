/**
 * Example extension.
 */
'use strict';

var exampleExtension = {};

/**
 * Route handler for the custom route.
 */
exampleExtension.exampleRouteHandler = function (req, res) {
  res.send({text: 'Hello world.'});
};

/**
 * Defines custom routes.
 *
 * Each route should specify the following:
 *   path: The path that the route will handle.
 *   type: 'get' or 'post'.
 *   handler: The callback function to call when this route is requested.
 *   auth: If true, the service key will be validated and the handler will only
 *     be called if the key is valid. This will also prepend the baseAuthPath
 *     to the path. E.g. the path /example might become /nodejs/example.
 */
exampleExtension.routes = [
  {
    path: '/example',
    type: 'get',
    auth: false,
    handler: exampleExtension.exampleRouteHandler
  }
];

/**
 * Implements the alterRoutes hook.
 * Use this hook to override routes defined in routes.js.
 */
exampleExtension.alterRoutes = function (routes) {
};

/**
 * Implements the alterSettings hook.
 * Use this hook to override settings defined in the config file, and to add
 * settings specific to this extension.
 */
exampleExtension.alterSettings = function (settings) {
};

/**
 * Implements the setup hook.
 * Called once after the app starts. Use this hook to add custom behavior to the
 * clientManager, and to initialize your extension.
 */
exampleExtension.setup = function (clientManager) {

  /**
   * The client-connection event is emitted when a new client connects.
   * The client is not authenticated yet, so it does not receive messages.
   */
  process.on('client-connection', function (sessionId) {
    console.log('Example extension got connection event for session ' + sessionId);
  });

  /**
   * The client-authenticated event is emitted after the client has been
   * authenticated.
   */
  process.on('client-authenticated', function (sessionId, authData) {
    console.log('Example extension got authenticated event for session ' + sessionId + ' (user ' + authData.uid + ')');
    clientManager.publishMessageToClient(sessionId, {data: {subject: 'Example extension', body: 'Welcome, you are authenticated.'}});
  });

  /**
   * The client-to-client-message event is emitted when a client sends a message
   * to another connected client.
   */
  process.on('client-to-client-message', function (sessionId, message) {
    console.log('Example extension got message event for session ' + sessionId);
  });

  /**
   * The client-to-channel-message event is emitted when a client sends a
   * message to a channel.
   */
  process.on('client-to-channel-message', function (sessionId, message) {
    console.log('Example extension got channel message event for session ' + sessionId);
  });

  /**
   * The client-disconnect event is emitted when a client disconnects.
   */
  process.on('client-disconnect', function (sessionId) {
    console.log('Example extension got disconnect event for session ' + sessionId);
  });

};

module.exports = exampleExtension;
