<?php

namespace Drupal\nodejs\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Component\Serialization\Json;

/**
 * Returns responses for Node.js routes.
 */
class NodejsPages {


  /**
   * @todo .
   */
  public function messageHandler() {
    if (!isset($_POST['serviceKey']) || !nodejs_is_valid_service_key($_POST['serviceKey'])) {
      return new JsonResponse(array('error' => 'Invalid service key.'), 404);
    }

    if (!isset($_POST['messageJson'])) {
      return new JsonResponse(array('error' => 'No message.'), 400);
    }

    $message = Json::decode($_POST['messageJson']);
    $response = array();
    switch ($message['messageType']) {
      case 'authenticate':
        $response = nodejs_auth_check($message);
        break;

      case 'userOffline':
        nodejs_user_set_offline($message['uid']);
        $response = array('status' => 'success');
        break;

      case 'userOnline':
        nodejs_user_set_online($message['uid']);
        $response = array('status' => 'success');
        break;

      default:
        $handlers = array();

        foreach (\Drupal::moduleHandler()->invokeAll('nodejs_message_callback', array($message['messageType'])) as $handler) {
          $handlers[] = $handler;
        }

        foreach ($handlers as $callback) {
          $callback($message, $response);
        }
    }

    \Drupal::moduleHandler()->alter('nodejs_message_response', $response, $message);

    if (!empty($response)) {
      return new JsonResponse($response);
    }
    else {
      return new JsonResponse(array('error' => 'Not implemented'), 400);
    }
  }

}
