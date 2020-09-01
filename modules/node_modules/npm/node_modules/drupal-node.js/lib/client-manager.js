/**
 * Submodule for handling communication with clients.
 */
'use strict';

var Utility = require('./utility');

/**
 * Constructor.
 */
function ClientManager(settings, backend) {
  this.settings = settings;
  this.backend = backend;
  this.authenticatedClients = {};
  this.preAuthSockets = {};
  this.sockets = {};
  this.onlineUsers = {};
  this.tokenChannels = {};
  this.presenceTimeoutIds = {},
  this.contentChannelTimeoutIds = {};
  this.channels =  {};

  this.logger = new Utility.Logger(this.settings);
};

/**
 * Registers a socket in the internal store.
 * @param socket
 *   A socket object.
 */
ClientManager.prototype.addSocket = function (socket) {
  var thisClientManager = this;
  this.preAuthSockets[socket.id] = socket;

  process.emit('client-connection', socket.id);

  socket.on('authenticate', function(message, ackCallback) {
    thisClientManager.authenticateClient(socket, message, ackCallback);
  });

  socket.on('join-token-channel', function(message) {
    thisClientManager.joinTokenChannel(socket.id, message);
  });

  socket.on('disconnect', function () {
    thisClientManager.cleanupSocket(socket);
  });
};

/**
 * Authenticate a client connection based on the message it sent.
 */
ClientManager.prototype.authenticateClient = function (client, message, ackCallback) {
  this.logger.debug("authenticateClient: Authenticating client with key " + message.authToken);

  if (this.authenticatedClients[message.authToken]) {
    this.logger.debug("authenticateClient: Reusing existing authentication data for key:" + message.authToken + ", client id:" + client.id);
    // setupClientConnection() copies the socket from preAuthSockets to sockets.
    this.setupClientConnection(client.id, this.authenticatedClients[message.authToken], message.contentTokens);
  }
  else {
    message.messageType = 'authenticate';
    message.clientId = client.id;
    (function (clientManager, message, ackCallback) {
      clientManager.backend.sendMessageToBackend(message, function (error, response, body) {
        if (!clientManager.authenticateClientCallback(error, response, body)) {
          clientManager.preAuthSockets[message.clientId].disconnect();
          delete clientManager.preAuthSockets[message.clientId];
        }
        else if (ackCallback) {
          ackCallback({'result': 'success'});
        }
      });
    })(this, message, ackCallback);
  }
};

/**
 * Adds the socket to a token channel.
 */
ClientManager.prototype.joinTokenChannel = function (socketId, message) {
  if (!this.sockets[socketId]) {
    // This socket is not authenticated yet.
    return;
  }

  var channel = message.channel;
  var token = message.contentToken;

  this.logger.debug("joinTokenChannel: Joining socket to token channel " + channel + " using token " + token);

  if (!channel || !token) {
    return;
  }

  this.tokenChannels[channel] = this.tokenChannels[channel] || {'tokens': {}, 'sockets': {}};

  if (this.tokenChannels[channel].tokens[token]) {
    this.tokenChannels[channel].sockets[socketId] = this.tokenChannels[channel].tokens[token];
    delete this.tokenChannels[channel].tokens[token];

    var notificationMessage = {
      callback: 'clientJoinedTokenChannel',
      data: this.tokenChannels[channel].sockets[socketId]
    };
    this.publishMessageToContentChannel(channel, notificationMessage);
  }
  else {
    this.logger.debug("joinTokenChannel: Invalid token used to join channel.");
  }
};

/**
 * Handle authentication call response.
 */
ClientManager.prototype.authenticateClientCallback = function (error, response, body) {
  if (error) {
    this.logger.log("authenticateClientCallback: Error with authenticate client request:", error);
    return false;
  }
  if (response.statusCode == 404) {
    this.logger.log("authenticateClientCallback: Backend authentication url not found.");
    this.logger.debug("authenticateClientCallback: Response body", body);
    return false;
  }
  if (response.statusCode == 301) {
    this.logger.log("authenticateClientCallback: Backend authentication url returns a 301 redirect. Please update the url in the configuration file.");
    this.logger.debug("authenticateClientCallback: Response body", body);
    return false;
  }

  var authData = false;
  try {
    authData = JSON.parse(body);
  }
  catch (exception) {
    this.logger.log("authenticateClientCallback: Failed to parse authentication message:", exception);
    this.logger.debug("Body", body);
    return false;
  }

  if (authData.error) {
    this.logger.log("authenticateClientCallback: Call failed: " + authData.error);
    return false;
  }

  if (!authData.nodejsValidAuthToken) {
    this.logger.log("authenticateClientCallback: Invalid login for uid " + authData.uid);
    return false;
  }

  this.logger.debug("authenticateClientCallback: Valid login for uid " + authData.uid);
  this.setupClientConnection(authData.clientId, authData, authData.contentTokens);
  this.authenticatedClients[authData.authToken] = authData;
  return true;
};

/**
 * Setup a sockets{}.connection with uid, channels etc.
 */
ClientManager.prototype.setupClientConnection = function (sessionId, authData, contentTokens) {
  if (!this.preAuthSockets[sessionId]) {
    this.logger.log("setupClientConnection: Client socket '" + sessionId + "' went away.");
    return;
  }
  this.sockets[sessionId] = this.preAuthSockets[sessionId];
  delete this.preAuthSockets[sessionId];

  this.sockets[sessionId].authToken = authData.authToken;
  this.sockets[sessionId].uid = authData.uid;
  for (var i in authData.channels) {
    this.channels[authData.channels[i]] = this.channels[authData.channels[i]] || {'sessionIds': {}};
    this.channels[authData.channels[i]].sessionIds[sessionId] = sessionId;
  }
  if (authData.uid != 0) {
    var sendPresenceChange = !this.onlineUsers[authData.uid];
    this.onlineUsers[authData.uid] = authData.presenceUids || [];
    if (sendPresenceChange) {
      this.backend.sendMessageToBackend({uid: authData.uid, messageType: 'userOnline'}, function (response) { });
      this.sendPresenceChangeNotification(authData.uid, 'online');
    }
  }

  var clientToken = '';
  for (var tokenChannel in contentTokens) {
    // @TODO: Need to check contentTokens.hasOwnProperty()?
    this.tokenChannels[tokenChannel] = this.tokenChannels[tokenChannel] || {'tokens': {}, 'sockets': {}};

    clientToken = contentTokens[tokenChannel];
    if (this.tokenChannels[tokenChannel].tokens[clientToken]) {
      this.tokenChannels[tokenChannel].sockets[sessionId] = this.tokenChannels[tokenChannel].tokens[clientToken];

      this.logger.debug("setupClientConnection: Added token " + clientToken + " for channel " + tokenChannel + " for socket " + sessionId);

      delete this.tokenChannels[tokenChannel].tokens[clientToken];
    }
  }

  process.emit('client-authenticated', sessionId, authData);

  // Notify client that they are now authenticated.
  var message = {
    callback: 'clientAuthenticated',
    data: authData
  };
  this.publishMessageToClient(sessionId, message);

  this.logger.debug("setupClientConnection: Added channels for uid " + authData.uid + ": " + authData.channels.toString());
  this.logger.debug("onlineUsers", this.onlineUsers);
};

/**
 * Send a presence notification for uid.
 */
ClientManager.prototype.sendPresenceChangeNotification = function (uid, presenceEvent) {
  if (this.onlineUsers[uid]) {
    for (var i in this.onlineUsers[uid]) {
      var sessionIds = this.getNodejsSessionIdsFromUid(this.onlineUsers[uid][i]);

      if (sessionIds.length > 0) {
        this.logger.debug("sendPresenceChangeNotification: Sending presence notification for " + uid + " to " + this.onlineUsers[uid][i]);
      }

      for (var j in sessionIds) {
        this.sockets[sessionIds[j]].json.send({'presenceNotification': {'uid': uid, 'event': presenceEvent}});
      }
    }
  }

  this.logger.debug("sendPresenceChangeNotification: onlineUsers", this.onlineUsers);
};

/**
 * Get the list of Node.js sessionIds for a given uid.
 */
ClientManager.prototype.getNodejsSessionIdsFromUid = function (uid) {
  var sessionIds = [];
  for (var sessionId in this.sockets) {
    if (this.sockets[sessionId].uid == uid) {
      sessionIds.push(sessionId);
    }
  }

  this.logger.debug("getNodejsSessionIdsFromUid", {uid: uid, sessionIds: sessionIds});

  return sessionIds;
};

/**
 * Cleanup after a socket has disconnected.
 */
ClientManager.prototype.cleanupSocket = function (socket) {
  process.emit('client-disconnect', socket.id);
  var thisClientManager = this;

  this.logger.debug("cleanupSocket: Cleaning up after socket id " + socket.id + ", uid " + socket.uid);

  if (this.preAuthSockets[socket.id]) {
    // This socket was not yet authenticated. No need for further cleanup.
    delete this.preAuthSockets[socket.id];
    return;
  }

  for (var channel in this.channels) {
    delete this.channels[channel].sessionIds[socket.id];
  }

  var uid = socket.uid;
  if (uid != 0) {
    if (this.presenceTimeoutIds[uid]) {
      clearTimeout(this.presenceTimeoutIds[uid]);
    }

    this.presenceTimeoutIds[uid] = setTimeout(function () {
      thisClientManager.checkOnlineStatus(uid);
    }, 2000);
  }

  for (var tokenChannel in this.tokenChannels) {
    this.logger.debug("cleanupSocket: checking tokenChannel " + tokenChannel + " for socket " + socket.id);

    if (this.tokenChannels[tokenChannel].sockets[socket.id]) {
      this.logger.debug("cleanupSocket: found socket info for tokenChannel " + tokenChannel, this.tokenChannels[tokenChannel].sockets[socket.id]);

      if (this.tokenChannels[tokenChannel].sockets[socket.id].notifyOnDisconnect) {
        if (this.contentChannelTimeoutIds[tokenChannel + '_' + uid]) {
          clearTimeout(this.contentChannelTimeoutIds[tokenChannel + '_' + uid]);
        }

        var timeoutFunction = (function (tokenChannel, uid) {
          return function () {
            thisClientManager.checkTokenChannelStatus(tokenChannel, uid);
          };
        })(tokenChannel, socket.uid);

        this.contentChannelTimeoutIds[tokenChannel + '_' + uid] = setTimeout(timeoutFunction, 2000);

      }
      delete this.tokenChannels[tokenChannel].sockets[socket.id];
    }
  }

  delete this.sockets[socket.id];
};

/**
 * Check for any open sockets for uid.
 */
ClientManager.prototype.checkOnlineStatus = function (uid) {
  if (this.getNodejsSessionIdsFromUid(uid).length == 0) {

    this.logger.debug("checkOnlineStatus: Sending offline notification for " + uid);

    this.setUserOffline(uid);
  }
};

/**
 * Sends offline notification to sockets, the backend and cleans up our list.
 */
ClientManager.prototype.setUserOffline = function (uid) {
  this.sendPresenceChangeNotification(uid, 'offline');
  delete this.onlineUsers[uid];
  this.backend.sendMessageToBackend({uid: uid, messageType: 'userOffline'}, function (response) { });
};

/**
 * Kicks a user.
 */
ClientManager.prototype.kickUser = function (uid) {
  // Delete the user from the authenticatedClients hash.
  for (var authToken in this.authenticatedClients) {
    if (this.authenticatedClients[authToken].uid == uid) {
      delete this.authenticatedClients[authToken];
    }
  }

  // Destroy any socket connections associated with this uid.
  for (var clientId in this.sockets) {
    if (this.sockets[clientId].uid == uid) {
      // @TODO: Need to clean up event listeners on the socket? Or call .cleanupSocket? Note: similar situation in .logoutUser.
      delete this.sockets[clientId];

      this.logger.debug("kickUser: deleted socket", {clientId: clientId, uid: uid});

      // Delete any channel entries for this clientId.
      for (var channel in this.channels) {
        delete this.channels[channel].sessionIds[clientId];
      }
    }
  }
};

/**
 * Add a user to a channel.
 * @return
 *   True on success, false if the client is not found.
 */
ClientManager.prototype.addUserToChannel = function (channel, uid) {
  this.channels[channel] = this.channels[channel] || {'sessionIds': {}};

  var sessionIds = this.getNodejsSessionIdsFromUid(uid);
  if (sessionIds.length > 0) {
    for (var i in sessionIds) {
      this.channels[channel].sessionIds[sessionIds[i]] = sessionIds[i];
    }

    this.logger.debug("addUserToChannel: Added channel " + channel + " to sessionIds " + sessionIds.join());

  }
  else {
    this.logger.log("addUserToChannel: No active sessions for uid: " + uid);
    return false;
  }

  // @TODO: Does this need to run even when the client is not connected?
  // (authenticatedClients data will be reused when the connect.)
  for (var authToken in this.authenticatedClients) {
    if (this.authenticatedClients[authToken].uid == uid) {
      if (this.authenticatedClients[authToken].channels.indexOf(channel) == -1) {
        this.authenticatedClients[authToken].channels.push(channel);

        this.logger.debug("addUserToChannel: Added user " + uid + " to channel " + channel);
        this.logger.debug("this.authenticatedClients", this.authenticatedClients);
      }
    }
  }

  return true;
};

/**
 * Get the list of Node.js sessionIds for a given authToken.
 */
ClientManager.prototype.getNodejsSessionIdsFromAuthToken = function (authToken) {
  var sessionIds = [];
  for (var sessionId in this.sockets) {
    if (this.sockets[sessionId].authToken == authToken) {
      sessionIds.push(sessionId);
    }
  }

  this.logger.debug("getNodejsSessionIdsFromAuthToken", {authToken: authToken, sessionIds: sessionIds});

  return sessionIds;
};

/**
 * Add an authToken to a channel.
 * @TODO Unused, needs testing.
 */
ClientManager.prototype.addAuthTokenToChannel = function (channel, authToken) {
  if (!this.authenticatedClients[authToken]) {
    this.logger.log("addAuthTokenToChannel: Unknown authToken: " + authToken);
    return false;
  }

  this.channels[channel] = this.channels[channel] || {'sessionIds': {}};
  var sessionIds = this.getNodejsSessionIdsFromAuthToken(authToken);
  if (sessionIds.length > 0) {
    for (var i in sessionIds) {
      this.channels[channel].sessionIds[sessionIds[i]] = sessionIds[i];
    }

    this.logger.debug("addAuthTokenToChannel: Added sessionIds " + sessionIds.join() + " to channel " + channel);

  }
  else {
    this.logger.log("addAuthTokenToChannel: No active sessions for authToken: " + authToken);
    return false;
  }

  if (this.authenticatedClients[authToken].channels.indexOf(channel) == -1) {
    this.authenticatedClients[authToken].channels.push(channel);

    this.logger.debug("addAuthTokenToChannel: Added channel " + channel + " to authenticatedClients");
  }

  return true;
};

/**
 * Remove an authToken from a channel.
 * @TODO Unused, needs testing.
 */
ClientManager.prototype.removeAuthTokenFromChannel = function (channel, authToken) {
  if (!this.authenticatedClients[authToken]) {
    this.logger.log("removeAuthTokenFromChannel: Invalid authToken: " + uid);
    return false;
  }
  if (this.channels[channel]) {
    var sessionIds = this.getNodejsSessionIdsFromAuthToken(authToken);
    for (var i in sessionIds) {
      if (this.channels[channel].sessionIds[sessionIds[i]]) {
        delete this.channels[channel].sessionIds[sessionIds[i]];
      }
    }

    if (this.authenticatedClients[authToken]) {
      var index = this.authenticatedClients[authToken].channels.indexOf(channel);
      if (index != -1) {
        delete this.authenticatedClients[authToken].channels[index];
      }
    }

    this.logger.debug("removeAuthTokenFromChannel: Successfully removed authToken " + authToken + " from channel " + channel);

    return true;
  }
  else {
    this.logger.log("removeAuthTokenFromChannel: Non-existent channel name " + channel);
    return false;
  }
};

/**
 * Add a client (specified by session ID) to a channel.
 * @TODO: Unused. Shall we keep it?
 */
ClientManager.prototype.addClientToChannel = function (sessionId, channel) {
  if (sessionId && channel) {
    if (!this.sockets.hasOwnProperty(sessionId)) {
      this.logger.log("addClientToChannel: Invalid sessionId: " + sessionId);
    }
    else if (!/^[a-z0-9_]+$/i.test(channel)) {
      this.logger.log("addClientToChannel: Invalid channel: " + channel);
    }
    else {
      this.channels[channel] = this.channels[channel] || {'sessionIds': {}};
      this.channels[channel].sessionIds[sessionId] = sessionId;

      this.logger.debug("addClientToChannel: Added channel " + channel + " to sessionId " + sessionId);

      return true;
    }
  }
  else {
    this.logger.log("addClientToChannel: Missing sessionId or channel name");
  }
  return false;
};

/**
 * Remove a client (specified by session ID) from a channel.
 * @TODO: Unused. Shall we keep it?
 */
ClientManager.prototype.removeClientFromChannel = function (sessionId, channel) {
  if (sessionId && channel) {
    if (!this.sockets.hasOwnProperty(sessionId)) {
      this.logger.log("removeClientFromChannel: Invalid sessionId: " + sessionId);
    }
    else if (!/^[a-z0-9_]+$/i.test(channel) || !this.channels.hasOwnProperty(channel)) {
      this.logger.log("removeClientFromChannel: Invalid channel: " + channel);
    }
    else if (this.channels[channel].sessionIds[sessionId]) {
      delete this.channels[channel].sessionIds[sessionId];

      this.logger.debug("removeClientFromChannel: Removed sessionId " + sessionId + " from channel " + channel);

      return true;
    }
  }
  else {
    this.logger.log("removeClientFromChannel: Missing sessionId or channel name");
  }
  return false;
};

/**
 * Remove a user from a channel.
 * @return
 *   True on success, false if the client is not found.
 */
ClientManager.prototype.removeUserFromChannel = function (channel, uid) {
  if (this.channels[channel]) {
    var sessionIds = this.getNodejsSessionIdsFromUid(uid);
    for (var i in sessionIds) {
      if (this.channels[channel].sessionIds[sessionIds[i]]) {
        delete this.channels[channel].sessionIds[sessionIds[i]];
      }
    }

    for (var authToken in this.authenticatedClients) {
      if (this.authenticatedClients[authToken].uid == uid) {
        var index = this.authenticatedClients[authToken].channels.indexOf(channel);
        if (index != -1) {
          delete this.authenticatedClients[authToken].channels[index];
        }
      }
    }

    this.logger.debug("removeUserFromChannel: Successfully removed uid " + uid + " from channel " + channel);

    return true;
  }
  else {
    this.logger.log("removeUserFromChannel: Non-existent channel name " + channel);
    return false;
  }
};

/**
 * Add a channel.
 */
ClientManager.prototype.addChannel = function (channel) {
  if (this.channels[channel]) {
    this.logger.log("addChannel: Channel name '" + channel + "' already exists.");
    return false;
  }

  this.channels[channel] = {'sessionIds': {}};

  this.logger.debug("addChannel: Successfully added channel " + channel);

  return true;
};

/**
 * Returns data for healthcheck purposes.
 */
ClientManager.prototype.getStats = function () {
  return {
    'authenticatedClients': Object.keys(this.authenticatedClients).length,
    'sockets': Object.keys(this.sockets).length,
    'onlineUsers': Object.keys(this.onlineUsers).length,
    'tokenChannels': Object.keys(this.tokenChannels).length,
    'contentTokens': this.tokenChannels
  }
};

/**
 * Checks whether a channel exists.
 * @param channel
 *   Channel name.
 * @return
 *   True on success false on error.
 */
ClientManager.prototype.checkChannel = function (channel) {
  if (this.channels[channel]) {
    this.logger.log("checkChannel: Channel name '" + channel + "' is active on the server.");
    return true;
  }
  else {
    this.logger.log("checkChannel: Channel name '" + channel + "' is not active on the server.");
    return false;
  }
};

/**
 * Remove a channel.
 * @param channel
 *   Channel name.
 * @return
 *   True on success false on error.
 */
ClientManager.prototype.removeChannel = function (channel) {
  if (this.channels[channel]) {
    delete this.channels[channel];

    this.logger.debug("removeChannel: Successfully removed channel " + channel);

    return true;
  }
  else {
    this.logger.log("removeChannel: Non-existent channel name " + channel);
    return false;
  }
};

/**
 * Set the list of users a uid can see presence info about.
 */
ClientManager.prototype.setUserPresenceList = function (uid, uidlist) {
  for (var i in uidlist) {
    if (!/^\d+$/.test(uidlist[i])) {
      this.logger.log("setUserPresenceList: Invalid uid: " + uid);
      return false;
    }
  }
  this.onlineUsers[uid] = uidlist;
};

/**
 * Get the list of backend uids and authTokens connected to a content token channel.
 */
ClientManager.prototype.getContentTokenChannelUsers = function (channel) {
  var users = {uids: [], authTokens: []};

  if (!channel || !this.tokenChannels[channel]) {
    return users;
  }

  for (var sessionId in this.tokenChannels[channel].sockets) {
    if (this.sockets[sessionId].uid) {
      users.uids.push(this.sockets[sessionId].uid);
    }
    else {
      users.authTokens.push(this.sockets[sessionId].authToken);
    }
  }
  return users;
};

/**
 * Set a content token.
 */
ClientManager.prototype.setContentToken = function (channel, token, value) {
  this.tokenChannels[channel] = this.tokenChannels[channel] || {'tokens': {}, 'sockets': {}};
  this.tokenChannels[channel].tokens[token] = value;
};

/**
 * Publish a message to clients subscribed to a channel.
 * @return
 *   True on success; false on error.
 */
ClientManager.prototype.publishMessageToContentChannel = function (channel, message) {
  if (!this.tokenChannels.hasOwnProperty(channel)) {
    this.logger.log("publishMessageToContentChannel: The channel " + channel + " doesn't exist.");
    return false;
  }

  for (var socketId in this.tokenChannels[channel].sockets) {
    this.publishMessageToClient(socketId, message);
  }
  return true;
};

/**
 * Logout the given user from the server.
 */
ClientManager.prototype.logoutUser = function (authToken) {
  // Delete the user from the authenticatedClients hash.
  delete this.authenticatedClients[authToken];

  // Destroy any socket connections associated with this authToken.
  for (var clientId in this.sockets) {
    if (this.sockets[clientId].authToken == authToken) {
      // @TODO: Ok to call cleanupSocket here? That method assumes the client has disconnected. Also, need to clean up
      // event listeners on the socket.
      this.cleanupSocket(this.sockets[clientId]);
    }
  }
};

/**
 * Check for any open sockets associated with the channel and socket pair.
 */
ClientManager.prototype.checkTokenChannelStatus = function (tokenChannel, uid) {
  // If the tokenChannel no longer exists, just bail.
  if (!this.tokenChannels[tokenChannel]) {
    this.logger.log("checkTokenChannelStatus: no tokenChannel " + tokenChannel);
    return;
  }

  // If we find a socket for this user in the given tokenChannel, we can just
  // return, as there's nothing we need to do.
  var sessionIds = this.getNodejsSessionIdsFromUid(uid);
  for (var i = 0; i < sessionIds.length; i++) {
    if (this.tokenChannels[tokenChannel].sockets[sessionIds[i]]) {
      this.logger.log("checkTokenChannelStatus: found socket for tokenChannel " + tokenChannel);
      return;
    }
  }

  // We didn't find a socket for this uid, and we have other sockets in this,
  // channel, so send disconnect notification message.
  var message = {
    'channel': tokenChannel,
    'contentChannelNotification': true,
    'data': {
      'uid': uid,
      'type': 'disconnect',
    }
  };
  for (var socketId in this.tokenChannels[tokenChannel].sockets) {
    this.publishMessageToClient(socketId, message);
  }
};

/**
 * Publish a message to a specific client.
 */
ClientManager.prototype.publishMessageToClient = function (sessionId, message) {
  if (this.sockets[sessionId]) {
    this.sockets[sessionId].json.send(message);

    this.logger.debug("publishMessageToClient: Sent message to client " + sessionId);

    return true;
  }
  else {
    this.logger.log("publishMessageToClient: Failed to find client " + sessionId);
  }
};

/**
 * Publish a message to clients subscribed to a channel.
 */
ClientManager.prototype.publishMessageToChannel = function (message) {
  if (!message.hasOwnProperty('channel')) {
    this.logger.log("publishMessageToChannel: An invalid message object was provided.");
    return 0;
  }
  if (!this.channels.hasOwnProperty(message.channel)) {
    this.logger.log("publishMessageToChannel: The channel " + message.channel + " doesn't exist.");
    return 0;
  }

  var clientCount = 0;
  for (var sessionId in this.channels[message.channel].sessionIds) {
    if (this.publishMessageToClient(sessionId, message)) {
      clientCount++;
    }
  }

  this.logger.debug("publishMessageToChannel: Sent message to " + clientCount + " clients in channel " + message.channel);

  return clientCount;
};

/**
 * Broadcasts a message to all sockets.
 */
ClientManager.prototype.broadcastMessage = function (message) {
  this.logger.debug("broadcastMessage", message);

  for (var socketId in this.sockets) {
    this.publishMessageToClient(socketId, message);
  }
};

/**
 * Returns the number of open sockets.
 */
ClientManager.prototype.getSocketCount = function () {
  return Object.keys(this.sockets).length;
};

module.exports = ClientManager;
