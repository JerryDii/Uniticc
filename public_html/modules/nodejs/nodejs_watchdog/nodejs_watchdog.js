(function ($, Drupal, drupalSettings) {

  Drupal.Nodejs.callbacks.nodejsWatchdog = {
    callback: function (message) {
      Drupal.nodejs_ajax.runCommands(message);
    }
  };

})(jQuery, Drupal, drupalSettings);

