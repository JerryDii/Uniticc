<?php

namespace Drupal\nodejs_watchdog\Logger;

use Psr\Log\LoggerInterface;
use Drupal\Core\Logger\RfcLoggerTrait;
use Drupal\Core\Logger\RfcLogLevel;
use Drupal\Component\Utility\Html;
use Drupal\Core\Ajax\BeforeCommand;
use Drupal\Core\Template\Attribute;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * Sends Nodejs messages for events.
 */
class NodejsLogger implements LoggerInterface, ContainerAwareInterface {
  use RfcLoggerTrait;
  use StringTranslationTrait;
  use ContainerAwareTrait;

  /**
   * {@inheritdoc}
   */
  public function log($level, $message, array $context = array()) {
    $classes = [
      RfcLogLevel::DEBUG     => 'dblog-debug',
      RfcLogLevel::INFO      => 'dblog-info',
      RfcLogLevel::NOTICE    => 'dblog-notice',
      RfcLogLevel::WARNING   => 'dblog-warning',
      RfcLogLevel::ERROR     => 'dblog-error',
      RfcLogLevel::CRITICAL  => 'dblog-critical',
      RfcLogLevel::ALERT     => 'dblog-alert',
      RfcLogLevel::EMERGENCY => 'dblog-emerg',
    ];

    // Processing and rendering follow the logic in DbLog::log and
    // DbLogController:overview.
    $parser = $this->container->get('logger.log_message_parser');
    $date_formatter = $this->container->get('date.formatter');
    $entity_manager = $this->container->get('entity.manager');
    $user_storage = $entity_manager->getStorage('user');

    $variables = $parser->parseMessagePlaceholders($message, $context);
    $message = $this->t((string) $message, $variables);
    $message = strip_tags($message);

    $username_element = [
      '#theme' => 'username',
      '#account' => $user_storage->load($context['uid']),
    ];

    $row = [
      'data' => [
        ['class' => ['icon']],
        $this->t($context['channel']),
        $date_formatter->format($context['timestamp'], 'short'),
        $message,
        ['data' => $username_element],
        $context['link'],
      ],
      // Attributes for table row.
      'class' => [Html::getClass('dblog-' . $context['channel']), $classes[$level]],
    ];

    // Send ajax command to the fronted to insert the new row into the table
    // on the watchdog page.
    $insert_command = new BeforeCommand('.admin-dblog tr:eq(1)', $this->renderRow($row));
    $commands[] = $insert_command->render();

    $nodejs_message = (object) [
      'channel' => 'watchdog_dblog',
      'commands' => $commands,
      'callback' => 'nodejsWatchdog',
    ];
    nodejs_send_content_channel_message($nodejs_message);
  }

  /**
   * Renders a watchdog row.
   */
  function renderRow($row) {
    $row_attributes = [];
    $output = '';

    $cells = [];
    foreach ($row as $key => $value) {
      if ($key == 'data') {
        $cells = $value;
      }
      else {
        $row_attributes[$key] = $value;
      }
    }

    if (!empty($cells)) {
      $output .= '<tr' . (new Attribute($row_attributes)) . '>';

      foreach ($cells as $cell) {
        if (is_array($cell)) {
          $data = isset($cell['data']) ? $cell['data'] : '';
          // Cell's data property can be a string or a renderable array.
          if (is_array($data)) {
            $data = $this->container->get('renderer')->renderRoot($data);
          }
          unset($cell['data']);

          $attributes = new Attribute($cell);
        }
        else {
          $attributes = '';
          $data = $cell;
        }

        $output .= '<td' . $attributes . '>' . $data . '</td>';
      }

      $output .= '</tr>';
    }

    return $output;
  }

}
