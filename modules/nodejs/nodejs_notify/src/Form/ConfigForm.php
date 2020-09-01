<?php

namespace Drupal\nodejs_notify\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class ConfigForm
 */
class ConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'nodejs_notify_config';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('nodejs_notify.settings');

    $form['notification_lifetime_seconds'] = [
      '#type' => 'number',
      '#title' => $this->t('Notification lifetime'),
      '#description' => $this->t('The number of seconds a notification will live before fading automatically. (Set to 0 for sticky notifications that do not fade.)'),
      '#default_value' => $config->get('notification_lifetime_seconds'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (!preg_match('/^\d+$/', $form_state->getValue('notification_lifetime_seconds'))) {
      $form_state->setErrorByName('notification_lifetime_seconds', $this->t('The notification lifetime must be a number.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('nodejs_notify.settings')
      ->set('notification_lifetime_seconds', $form_state->getValue('notification_lifetime_seconds'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return [
      'nodejs_notify.settings',
    ];
  }
}
