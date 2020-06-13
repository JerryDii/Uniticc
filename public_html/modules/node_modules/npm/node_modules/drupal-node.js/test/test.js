var assert = require('assert');
var querystring = require('querystring');
var nock = require('nock');
var url = require('url');
var request = require('request');
var io = require('socket.io-client');
var configManager = require('../lib/config-manager');
var server = require('../lib/server');

describe('Server app', function () {
  this.timeout(1000);

  var client;

  var settings = {
    scheme: 'http',
    port: 8080,
    host: 'localhost',
    resource: '/socket.io',
    serviceKey: '__LOL_TESTING__',
    debug: false,
    baseAuthPath: '/nodejs/',
    extensions: [],
    transports: ['websocket', 'polling'],
    jsMinification: true,
    jsEtag: true,
    backend: {
      host: 'localhost',
      scheme: 'http',
      port: 8000,
      basePath: '/',
      strictSSL: false,
      messagePath: 'nodejs/message',
      httpAuth: ''
    },
    test: {
      authToken: 'lol_test_auth_token',
      uid: 666,
      clientId: 'lotestclientid'
    },
    logLevel: 1,
    socketOptions: {
      path: '/some-other-path'
    }
  };

  var serverUrl = url.format({
    protocol: settings.scheme,
    hostname: settings.host,
    port: settings.port,
    pathname: settings.baseAuthPath
  });

  var backendHost = url.format({
    protocol: settings.backend.scheme,
    hostname: settings.backend.host,
    port: settings.backend.port
  });
  var backendMessagePath = settings.backend.basePath + settings.backend.messagePath;

  var requestOptions = {
    url: serverUrl,
    json: true,
    headers: {
      'NodejsServiceKey': settings.serviceKey
    }
  };

  var bodyMatch = function (body) {
    return true;
  };

  var authResult = {
    nodejsValidAuthToken: true,
    clientId: settings.test.clientId,
    channels: [],
    uid: settings.test.uid
  };

  var authSuccessCheck = function (response) {
    assert.equal(response.result, 'success');
    done();
  };

  before(function () {
    configManager.setSettings(settings);
    server.start(configManager);
  });

  after(function () {
    process.exit();
  });

  it('should respond to requests', function(done) {
    request.get(serverUrl, function(error, response, body) {
      assert(!error);
      done();
    });
  });

  it('should reject missing service key', function(done) {
    var failingRequestOptions = {
      url: serverUrl,
      json: true,
    };

    request.get(failingRequestOptions, function(error, response, body) {
      assert.equal(body.error, 'Invalid service key.');
      done();
    });
  });

  it('should accept correct service key', function(done) {
    requestOptions.url = serverUrl + 'fakepath';

    request.get(requestOptions, function(error, response, body) {
      assert.equal(response.statusCode, 404);
      done();
    });
  });

  it('should accept content tokens', function(done) {
    requestOptions.url = serverUrl + 'content/token';
    requestOptions.body = {
      channel: 'test_channel',
      token: 'mytoken'
    };

    request.post(requestOptions, function(error, response, body) {
      assert.equal(body.status, 'success');
      done();
    });
  });

  it('should store content tokens', function(done) {
    requestOptions.url = serverUrl + 'health/check';

    request.get(requestOptions, function(error, response, body) {
      assert(body.contentTokens['test_channel']);
      done();
    });
  });

  it('should create channel', function(done) {
    requestOptions.url = serverUrl + 'channel/add/test_channel_2';

    request.post(requestOptions, function(error, response, body) {
      assert.equal(body.status, 'success');
      done();
    });
  });

  it('should persist channel', function(done) {
    requestOptions.url = serverUrl + 'channel/check/test_channel_2';

    request.get(requestOptions, function(error, response, body) {
      assert.equal(body.status, 'success');
      done();
    });
  });

  it('should allow client connections with valid tokens', function(done) {
    client = io.connect(settings.scheme + '://' + settings.host + ':' + settings.port, {path: settings.socketOptions.path});
    client.on('connect', function() {
      authResult.clientId = client.nsp + '#' + client.id;
      nock(backendHost).post(backendMessagePath, bodyMatch).reply(200, authResult);
      client.emit('authenticate', {authToken: settings.test.authToken}, function (response) {
        assert.equal(response.result, 'success');
        done();
      });
    });
  });

  it('should disconnect client connections with invalid tokens', function(done) {
    client = io.connect(settings.scheme + '://' + settings.host + ':' + settings.port, {path: settings.socketOptions.path});
    client.on('connect', function() {
      authResult.clientId = client.nsp + '#' + client.id;
      authResult.nodejsValidAuthToken = false;
      nock(backendHost).post(backendMessagePath, bodyMatch).reply(200, authResult);
      client.emit('authenticate', {authToken: '__bad_auth_token__'});
    });
    client.on('disconnect', function() {
      done();
    });
  });

});
