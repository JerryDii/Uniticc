/**
 * @file
 * Removes whitespace from the highlighted region when an alert is closed.
 *
 */
(function ($, Drupal) {

  /**
   * Removes whitespace from the highlighted region when an alert is closed.
   */
  Drupal.behaviors.foundationAlertClose = {
    attach: function (context, settings) {

      $('.zurb-foundation-callout').once('foundation-alert').on('closed.zf', function(event) {
        var $target = $(event.target);
        var $region = $target.parent();

        // Remove this alert from the DOM, if it has no siblings.
        if (!$target.siblings().length) {
          $target.remove();

          // Trim newlines out of the highlighted region, so that our :empty
          // selector still works.
          $region.html($region.html().replace(/\n/g, ''));
        }
      });
    }
  };

})(jQuery, Drupal);
