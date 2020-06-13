# Node.js Integration for Drupal

Server app for the Node.js Integration Drupal module.
https://www.drupal.org/project/nodejs

## Prerequisites

* [Node.js](https://nodejs.org) version 10+
* [Forever](https://github.com/foreverjs/forever) (optional)

## Installation

Use one of the following two methods to download the app:

* Install using NPM by running `npm install drupal-node.js`. Note that the
app will be installed in the node_modules subdirectory

* Download the
[latest release](https://github.com/beejeebus/drupal-nodejs/releases) from
GitHub. Unzip, and run `npm install` in the app's directory to install the
dependencies

In both cases, be sure the install the app outside of Drupal's root directory.

## Configuration

Copy the example configuration file (`nodejs.config.js.example`) to
`nodejs.config.js`. Edit that file and make any necessary configuration changes.
See [nodejs.config.js.example](https://github.com/beejeebus/drupal-nodejs/blob/master/nodejs.config.js.example)
for details on the configuration values. As a minimum, you will need to set the
`serviceKey`, and specify the location of your Drupal site in the `backend`
property. The service key can be any arbitrary string, but be sure to enter the
same service key in Drupal.

### HTTPS

If you set `scheme: 'https'` you will need to set sslKeyPath and sslCertPath

## Running the server app

Start the app using the `node` command.

```
node app.js
```

This will run the app in the foreground. For production use, it is more
practical to run the app in the background. One way to achieve this is starting
the app with [forever](https://github.com/foreverjs/forever).

```
forever start app.js
```

Not only will forever start the app in the background, but it will monitor it
and automatically restart it if the app quits.

Visit the status report on your Drupal site to verify if Drupal is able to
communicate with the server app.
