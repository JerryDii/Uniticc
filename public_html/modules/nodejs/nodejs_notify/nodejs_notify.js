(function ($, Drupal, drupalSettings) {

  Drupal.Nodejs.callbacks.nodejsNotify = {
    callback: function (message) {
      var notifyTime = drupalSettings.nodejs_notify.notification_time;

      if (notifyTime > 0) {
        $.jGrowl(message.data.body, {header: message.data.subject, life:(notifyTime * 1000)});
      }
      else {
        $.jGrowl(message.data.body, {header: message.data.subject, sticky:true});
      }
    }
  };

})(jQuery, Drupal, drupalSettings);

