/**
 * Submodule for router callbacks.
 */
'use strict';

/**
 * Constructor.
 */
function Routes() {
  // Dependencies are injected by a middleware into the request object in each route callback.
  // Available objects:
  //   - request.clientManager
  //   - request.clientManager.backend
  //   - request.clientManager.settings
}

/**
 * Callback that wraps all requests and checks for a valid service key.
 */
Routes.prototype.checkServiceKey = function (request, response, next) {
  request.clientManager.logger.debug("Route callback: checkServiceKey");

  if (request.clientManager.backend.checkServiceKey(request.header('NodejsServiceKey', ''))) {
    next();
  }
  else {
    response.send({'error': 'Invalid service key.'});
  }
};

/**
 * Http callback - read in a JSON message and publish it to interested clients.
 */
Routes.prototype.publishMessage = function (request, response) {
  request.clientManager.logger.debug("Route callback: publishMessage");
  request.clientManager.logger.debug("Body", request.body);

  if (!request.body.channel && !request.body.broadcast) {
    response.send({error: 'Required parameters are missing.'});
    return;
  }

  var sentCount = 0;

  if (request.body.broadcast) {
    request.clientManager.broadcastMessage(request.body);
    sentCount = request.clientManager.getSocketCount();
  }
  else {
    sentCount = request.clientManager.publishMessageToChannel(request.body);
  }

  process.emit('message-published', request.body, sentCount);
  response.send({status: 'success', sent: sentCount});
};

/**
 * Kicks the given logged in user from the server.
 */
Routes.prototype.kickUser = function (request, response) {
  request.clientManager.logger.debug("Route callback: kickUser");

  if (request.params.uid) {
    request.clientManager.kickUser(request.params.uid);
    response.send({'status': 'success'});
    return;
  }

  request.clientManager.logger.log('Failed to kick user, no uid supplied');

  response.send({'status': 'failed', 'error': 'missing uid'});
};

/**
 * Logout the given user from the server.
 */
Routes.prototype.logoutUser = function (request, response) {
  request.clientManager.logger.debug("Route callback: logoutUser");

  var authToken = request.params.authtoken || '';
  if (authToken) {
    request.clientManager.logger.log('Logging out http session ' + authToken);

    request.clientManager.kickUser(authToken);
    response.send({'status': 'success'});
    return;
  }

  request.clientManager.logger.log('Failed to logout user, no authToken supplied');

  response.send({'status': 'failed', 'error': 'missing authToken'});
};

/**
 * Add a user to a channel.
 */
Routes.prototype.addUserToChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: addUserToChannel");

  var uid = request.params.uid || '';
  var channel = request.params.channel || '';

  if (uid && channel) {
    if (!/^\d+$/.test(uid)) {
      request.clientManager.logger.log("Invalid uid: " + uid);
      response.send({'status': 'failed', 'error': 'Invalid uid.'});
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log("Invalid channel: " + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.addUserToChannel(channel, uid);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': 'No active sessions for uid.'});
    }
  }
  else {
    request.clientManager.logger.log("Missing uid or channel");
    response.send({'status': 'failed', 'error': 'Missing uid or channel'});
  }
};

/**
 * Remove a user from a channel.
 */
Routes.prototype.removeUserFromChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: removeUserFromChannel");

  var uid = request.params.uid || '';
  var channel = request.params.channel || '';
  if (uid && channel) {
    if (!/^\d+$/.test(uid)) {
      request.clientManager.logger.log('Invalid uid: ' + uid);
      response.send({'status': 'failed', 'error': 'Invalid uid.'});
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log('Invalid channel: ' + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.removeUserFromChannel(channel, uid);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': 'Non-existent channel name.'});
    }
  }
  else {
    request.clientManager.logger.log("Missing uid or channel");
    response.send({'status': 'failed', 'error': 'Invalid data'});
  }
};

/**
 * Add a channel.
 */
Routes.prototype.addChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: addChannel");

  var channel = request.params.channel || '';
  if (channel) {
    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log('Invalid channel: ' + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.addChannel(channel);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': "Channel name '" + channel + "' already exists."});
    }
  }
  else {
    request.clientManager.logger.log("Missing channel");
    response.send({'status': 'failed', 'error': 'Invalid data: missing channel'});
  }
};

/**
 * Http callback - read in a JSON message and publish it to interested clients.
 */
Routes.prototype.healthCheck = function (request, response) {
  request.clientManager.logger.debug("Route callback: healthCheck");

  var data = request.clientManager.getStats();
  data.status = 'success';
  data.version = global.version;
  response.send(data);
};

/**
 * Checks whether a channel exists.
 */
Routes.prototype.checkChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: checkChannel");

  var channel = request.params.channel || '';
  if (channel) {
    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log('Invalid channel: ' + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.checkChannel(channel);

    if (result) {
      response.send({'status': 'success', 'result': true});
    }
    else {
      response.send({'status': 'success', 'result': false});
    }
  }
  else {
    request.clientManager.logger.log("Missing channel");
    response.send({'status': 'failed', 'error': 'Invalid data: missing channel'});
  }
};

/**
 * Remove a channel.
 */
Routes.prototype.removeChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: removeChannel");

  var channel = request.params.channel || '';
  if (channel) {
    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log('Invalid channel: ' + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.removeChannel(channel);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': 'Non-existent channel name.'});
    }
  }
  else {
    request.clientManager.logger.log("Missing channel");
    response.send({'status': 'failed', 'error': 'Invalid data: missing channel'});
  }
};

/**
 * Set the list of users a uid can see presence info about.
 */
Routes.prototype.setUserPresenceList = function (request, response) {
  request.clientManager.logger.debug("Route callback: setUserPresenceList");

  var uid = request.params.uid || '';
  var uidlist = request.params.uidlist.split(',') || [];
  if (uid && uidlist) {
    if (!/^\d+$/.test(uid)) {
      request.clientManager.logger.log("Invalid uid: " + uid);
      response.send({'status': 'failed', 'error': 'Invalid uid.'});
      return;
    }
    if (uidlist.length == 0) {
      request.clientManager.logger.log("Empty uidlist");
      response.send({'status': 'failed', 'error': 'Empty uid list.'});
      return;
    }

    var result = request.clientManager.setUserPresenceList(uid, uidlist);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': 'Invalid uid.'});
    }
  }
  else {
    response.send({'status': 'failed', 'error': 'Invalid parameters.'});
  }
};

/**
 * Http callback - return the list of content channel users.
 */
Routes.prototype.getContentTokenUsers = function (request, response) {
  request.clientManager.logger.debug("Route callback: getContentTokenUsers");
  request.clientManager.logger.debug("Body", request.body);

  if (!request.body.channel) {
    response.send({error: 'Required parameters are missing.'});
    return;
  }

  var users = request.clientManager.getContentTokenChannelUsers(request.body.channel);
  request.clientManager.logger.debug("users", users);

  response.send({users: users});
};

/**
 * Set a content token.
 */
Routes.prototype.setContentToken = function (request, response) {
  request.clientManager.logger.debug("Route callback: setContentToken");
  request.clientManager.logger.debug("Body", request.body);

  if (!request.body.channel || !request.body.token) {
    response.send({error: 'Required parameters are missing.'});
    return;
  }

  request.clientManager.setContentToken(request.body.channel, request.body.token, request.body);

  response.send({status: 'success'});
};

/**
 * Publish a message to clients subscribed to a channel.
 */
Routes.prototype.publishMessageToContentChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: publishMessageToContentChannel");
  request.clientManager.logger.debug("Body", request.body);

  if (!request.body.channel) {
    request.clientManager.logger.log('An invalid message object was provided.');
    response.send({error: 'Invalid message'});
    return;
  }

  var result = request.clientManager.publishMessageToContentChannel(request.body.channel, request.body);
  if (result) {
    response.send({status: 'success'});
  }
  else {
    response.send({error: 'Invalid message'});
  }
};

/**
 * Add an authToken to a channel.
 * @TODO Unused, needs testing.
 */
Routes.prototype.addAuthTokenToChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: addAuthTokenToChannel");

  var authToken = request.params.authToken || '';
  var channel = request.params.channel || '';
  if (!authToken || !channel) {
    request.clientManager.logger.log("Missing authToken or channel");
    response.send({'status': 'failed', 'error': 'Missing authToken or channel'});
    return;
  }

  if (!/^[a-z0-9_]+$/i.test(channel)) {
    request.clientManager.logger.log("Invalid channel: " + channel);
    response.send({'status': 'failed', 'error': 'Invalid channel name.'});
    return;
  }

  var result = request.clientManager.addAuthTokenToChannel(channel, authToken);
  if (result) {
    response.send({'status': 'success'});
  }
  else {
    response.send({'status': 'failed', 'error': 'Invalid parameters.'});
  }
};

/**
 * Remove an authToken from a channel.
 * @TODO Unused, needs testing.
 */
Routes.prototype.removeAuthTokenFromChannel = function (request, response) {
  request.clientManager.logger.debug("Route callback: removeAuthTokenFromChannel");

  var authToken = request.params.authToken || '';
  var channel = request.params.channel || '';
  if (authToken && channel) {


    if (!/^[a-z0-9_]+$/i.test(channel)) {
      request.clientManager.logger.log('Invalid channel: ' + channel);
      response.send({'status': 'failed', 'error': 'Invalid channel name.'});
      return;
    }

    var result = request.clientManager.removeAuthTokenFromChannel(channel, authToken);
    if (result) {
      response.send({'status': 'success'});
    }
    else {
      response.send({'status': 'failed', 'error': 'Invalid parameters.'});
    }
  }
  else {
    request.clientManager.logger.log("Missing authToken or channel");
    response.send({'status': 'failed', 'error': 'Invalid data'});
  }
};

/**
 * Http callback - set the debug flag.
 */
Routes.prototype.toggleDebug = function (request, response) {
  request.clientManager.logger.debug("Route callback: toggleDebug");

  if (!request.body.debug) {
    response.send({error: 'Required parameters are missing.'});
    return;
  }

  request.clientManager.settings.debug = request.body.debug;
  response.send({status: 'success', debug: request.body.debug});
};

/**
 * Sends a 404 message.
 */
Routes.prototype.send404 = function (request, response) {
  request.clientManager.logger.debug("Route callback: send404");

  response.status(404).send('Not Found.');
};

module.exports = Routes;
