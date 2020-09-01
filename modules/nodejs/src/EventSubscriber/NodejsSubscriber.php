<?php

namespace Drupal\nodejs\EventSubscriber;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\PostResponseEvent;
use Drupal\nodejs\Nodejs;

class NodejsSubscriber implements EventSubscriberInterface {

  protected $nodejs;

  public function __construct(Nodejs $nodejs) {
    $this->nodejs = $nodejs;
  }

  public function sendMessages(PostResponseEvent $event) {
    $this->nodejs->sendMessages();
  }

  /**
   * {@inheritdoc}
   */
  static function getSubscribedEvents() {
    $events[KernelEvents::TERMINATE][] = array('sendMessages', 40);
    return $events;
  }

}
