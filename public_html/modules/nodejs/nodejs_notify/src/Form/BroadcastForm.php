<?php

namespace Drupal\nodejs_notify\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class BroadcastForm
 */
class BroadcastForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'nodejs_notify_broadcast';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['broadcast_form'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Broadcast Notification'),
    ];

    $form['broadcast_form']['broadcast_subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Broadcast notification subject'),
      '#required' => TRUE,
    ];

    $form['broadcast_form']['broadcast_message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Broadcast notification message'),
      '#required' => TRUE,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Broadcast'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    nodejs_broadcast_message($form_state->getValue('broadcast_subject'), $form_state->getValue('broadcast_message'));
    $this->messenger()->addStatus(t("Message broadcast to all users"));
  }

}
