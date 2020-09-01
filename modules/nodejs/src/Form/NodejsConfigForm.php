<?php

namespace Drupal\nodejs\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configure node.js integration.
 */
class NodejsConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormID() {
    return 'nodejs_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->configFactory->get('nodejs.config');
    $form['server'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Node.js Drupal settings'),
    );
    $form['server']['scheme'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Drupal to Node.js server protocol'),
      '#default_value' => $config->get('nodejs.scheme'),
      '#options' => array('http' => t('http'), 'https' => t('https')),
      '#description' => $this->t('The protocol used to communicate with the Node.js server from Drupal PHP code.'),
    );
    $form['server']['host'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Node.js server host'),
      '#default_value' => $config->get('nodejs.host'),
      '#size' => 40,
      '#required' => TRUE,
      '#description' => $this->t('The hostname of the Node.js server.'),
    );
    $form['server']['port'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Node.js server port'),
      '#default_value' => $config->get('nodejs.port'),
      '#size' => 10,
      '#required' => TRUE,
      '#description' => $this->t('The port of the Node.js server.'),
    );
    $form['server']['service_key'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Service Key'),
      '#required' => TRUE,
      '#description' => $this->t('An arbitrary string used as a secret between the node.js server and the Drupal site. This setting needs to match the Node.js server configuration.'),
      '#default_value' => $config->get('service_key'),
    );
    $description = $this->t("Enter one page per line as Drupal paths. The '*' character is a wildcard.
                      Example paths are %blog for the blog page and %blog-wildcard for every personal blog.
                      %front is the front page.",
                      array('%blog' => '/blog', '%blog-wildcard' => '/blog/*', '%front' => '<front>'));
    $form['server']['pages'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Pages on which to enable nodejs'),
      '#default_value' => $config->get('pages'),
      '#required' => TRUE,
      '#description' => $description,
    );
    $form['server']['client_scheme'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Client javascript to Node.js server protocol'),
      '#default_value' => $config->get('client.scheme'),
      '#options' => array('http' => t('http'), 'https' => t('https')),
      '#description' => $this->t('The protocol used to communicate with the Node.js server from client javascript code.'),
    );
    $form['server']['client_host'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Node.js server host for client javascript.'),
      '#default_value' => $config->get('client.host'),
      '#size' => 40,
      '#required' => TRUE,
      '#description' => $this->t('The hostname of the Node.js server.'),
    );
    $form['server']['client_port'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Node.js server port for client javacript'),
      '#default_value' => $config->get('client.port'),
      '#size' => 10,
      '#required' => TRUE,
      '#description' => $this->t('The port of the Node.js server.'),
    );
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->configFactory->getEditable('nodejs.config')
      ->set('nodejs.scheme', $form_state->getValue('scheme'))
      ->set('nodejs.host', $form_state->getValue('host'))
      ->set('nodejs.port', $form_state->getValue('port'))
      ->set('client.scheme', $form_state->getValue('client_scheme'))
      ->set('client.host', $form_state->getValue('client_host'))
      ->set('client.port', $form_state->getValue('client_port'))
      ->set('pages', $form_state->getValue('pages'))
      ->set('service_key', $form_state->getValue('service_key'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['nodejs.config'];
  }
}
