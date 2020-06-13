(function ($, Drupal, drupalSettings) {

Drupal.Nodejs = Drupal.Nodejs || {
  'contentChannelNotificationCallbacks': {},
  'presenceCallbacks': {},
  'callbacks': {},
  'socket': false,
  'connectionSetupHandlers': {}
};

Drupal.behaviors.nodejs = {
  attach: function () {
    if (!Drupal.Nodejs.socket) {
      Drupal.Nodejs.connect();
    }
  }
};

Drupal.Nodejs.runCallbacks = function (message) {
  // It's possible that this message originated from an ajax request from the
  // client associated with this socket.
  if (Drupal.Nodejs.socket.sessionid && message.clientSocketId == Drupal.Nodejs.socket.sessionid) {
    return;
  }

  if (message.callback) {
    if (typeof message.callback == 'string') {
      message.callback = [message.callback];
    }
    $.each(message.callback, function () {
      var callback = this;
      if (Drupal.Nodejs.callbacks[callback] && $.isFunction(Drupal.Nodejs.callbacks[callback].callback)) {
        try {
          Drupal.Nodejs.callbacks[callback].callback(message);
        }
        catch (exception) {}
      }
    });
  }
  else if (message.presenceNotification != undefined) {
    $.each(Drupal.Nodejs.presenceCallbacks, function () {
      if ($.isFunction(this.callback)) {
        try {
          this.callback(message);
        }
        catch (exception) {}
      }
    });
  }
  else if (message.contentChannelNotification != undefined) {
    $.each(Drupal.Nodejs.contentChannelNotificationCallbacks, function () {
      if ($.isFunction(this.callback)) {
        try {
          this.callback(message);
        }
        catch (exception) {}
      }
    });
  }
  else {
    $.each(Drupal.Nodejs.callbacks, function () {
      if ($.isFunction(this.callback)) {
        try {
          this.callback(message);
        }
        catch (exception) {}
      }
    });
  }
};

Drupal.Nodejs.runSetupHandlers = function (type) {
  $.each(Drupal.Nodejs.connectionSetupHandlers, function () {
    if ($.isFunction(this[type])) {
      try {
        this[type]();
      }
      catch (exception) {}
    }
  });
};

Drupal.Nodejs.connect = function () {
  var url = drupalSettings.nodejs.client.scheme + '://' + drupalSettings.nodejs.client.host + ':' + drupalSettings.nodejs.client.port;
  drupalSettings.nodejs.connectTimeout = drupalSettings.nodejs.connectTimeout || 5000;
  if (typeof io === 'undefined') {
     return false;
  }
  Drupal.Nodejs.socket = io.connect(url, {
    timeout: drupalSettings.nodejs.connectTimeout,
    transports: drupalSettings.nodejs.client.transports,
    path: drupalSettings.nodejs.client.path,
  });
  Drupal.Nodejs.socket.on('connect', function() {
    Drupal.Nodejs.sendAuthMessage();
    Drupal.Nodejs.runSetupHandlers('connect');
    if (Drupal.ajax != undefined) {
      // Monkey-patch Drupal.ajax.prototype.beforeSerialize to auto-magically
      // send sessionId for AJAX requests so we can exclude the current browser
      // window from resulting notifications. We do this so that modules can hook
      // in to other modules ajax requests without having to patch them.
      Drupal.Nodejs.originalBeforeSerialize = Drupal.ajax.prototype.beforeSerialize;
      Drupal.ajax.prototype.beforeSerialize = function(element_settings, options) {
        options.data['nodejs_client_socket_id'] = Drupal.Nodejs.socket.socket.sessionid;
        return Drupal.Nodejs.originalBeforeSerialize(element_settings, options);
      };
    }
  });

  Drupal.Nodejs.socket.on('message', Drupal.Nodejs.runCallbacks);

  Drupal.Nodejs.socket.on('disconnect', function() {
    Drupal.Nodejs.runSetupHandlers('disconnect');
    if (Drupal.ajax != undefined) {
      Drupal.ajax.prototype.beforeSerialize = Drupal.Nodejs.originalBeforeSerialize;
    }
  });
  setTimeout("Drupal.Nodejs.checkConnection()", drupalSettings.nodejs.connectTimeout + 250);
};

Drupal.Nodejs.checkConnection = function () {
  if (!Drupal.Nodejs.socket.connected) {
    Drupal.Nodejs.runSetupHandlers('connectionFailure');
  }
};

Drupal.Nodejs.joinTokenChannel = function (channel, contentToken) {
  var joinMessage = {
    channel: channel,
    contentToken: contentToken
  };

  // Add to the global settings so that the user is joined again when the client reconnects.
  drupalSettings.nodejs.contentTokens = drupalSettings.nodejs.contentTokens || {};
  drupalSettings.nodejs.contentTokens[channel] = contentToken;

  Drupal.Nodejs.socket.emit('join-token-channel', joinMessage);
};

Drupal.Nodejs.sendAuthMessage = function () {
  var authMessage = {
    authToken: drupalSettings.nodejs.authToken,
    contentTokens: drupalSettings.nodejs.contentTokens
  };
  Drupal.Nodejs.socket.emit('authenticate', authMessage);
};

})(jQuery, Drupal, drupalSettings);

