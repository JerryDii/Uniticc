<?php

namespace Drupal\nodejs_config\Form;

use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Json;

/**
 * Node.js server configuration form.
 */
class NodejsConfigSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'nodejs_config_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $main_config = $this->configFactory->get('nodejs.config');
    $config = $this->configFactory->get('nodejs_config.settings');
    $suggestion = $config->get('js_suggestion');
    $file_path = drupal_get_path('module', 'nodejs') . '/nodejs.config.js';
    $config_path_message = $this->t('<ol><li>Configure your server settings in the SETTINGS form below.</li><li>Click the <b>Save configuration</b> button.</li><li>Copy the suggested configuration to <b>!file</b>. You will need to do this step manually.</li></ol>', array('!file' => $file_path));

    $form['config_suggestion'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Configuration builder'),
      '#description' => $config_path_message,
    );
    $form['config_suggestion']['nodejs_config_js'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Suggested configuration:'),
      '#default_value' => $suggestion,
    );
    $form['config'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Settings'),
    );
    $form['config']['nodejs_config_host'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Host'),
      '#required' => TRUE,
      '#description' => $this->t('Specify the host name or IP address that the node.js server should listen on.
                                  Leave blank to listen for any host name. Otherwise, the server will only respond
                                  to names that match the IP address given (or resolved from the given name).'),
      '#default_value' => $config->get('host'),
    );
    $form['config']['nodejs_config_port'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Port'),
      '#required' => TRUE,
      '#description' => $this->t('Specify the TCP port that the node.js server should listen on.'),
      '#default_value' => $config->get('port'),
    );

    $form['config']['nodejs_server_scheme'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Protocol used by Node.js server'),
      '#default_value' => $config->get('scheme'),
      '#options' => array(
        'http' => t('http'),
        'https' => t('https'),
      ),
      '#description' => $this->t('The protocol used to communicate with the Node.js server.'),
    );

    $form['config']['nodejs_config_key'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('SSL key file'),
      '#required' => TRUE,
      '#description' => $this->t('File system path to the key used for secure communication.'),
      '#default_value' => $config->get('key'),
    );
    $form['config']['nodejs_config_cert'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('SSL certificate file'),
      '#required' => TRUE,
      '#description' => $this->t('File system path to the certificate used for secure communication.'),
      '#default_value' => $config->get('cert'),
    );
    $form['config']['nodejs_config_publish_url'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Publish URL'),
      '#required' => TRUE,
      '#description' => $this->t('Path on which the node.js server should accept messages from the Drupal site.'),
      '#default_value' => $config->get('publish_url'),
    );
    $form['config']['nodejs_service_key'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Service key'),
      '#description' => $this->t('An arbitrary string used as a secret between the node.js server and the Drupal site. The key can be changed in the Nodejs integration settings.'),
      '#default_value' => $main_config->get('nodejs_service_key'),
      '#disabled' => TRUE,
    );
    $form['config']['nodejs_config_write_channels'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Client write to channels'),
      '#description' => $this->t('Global flag that allows all channels to be written to by client sockets without
                                  going via the backend. Defaults to false.'),
      '#default_value' => $config->get('write_channels'),
    );
    $form['config']['nodejs_config_write_clients'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Client write to clients'),
      '#description' => $this->t('Global flag that allows all clients to be written to by client sockets
                                  without going via the backend. Defaults to false.'),
      '#default_value' => $config->get('write_clients'),
    );
    $form['config']['backend'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Backend'),
    );
    $form['config']['backend']['nodejs_config_backend_host'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Host'),
      '#required' => TRUE,
      '#description' => $this->t('Host name of the Drupal site.'),
      '#default_value' => $config->get('backend_host'),
    );
    $form['config']['backend']['nodejs_config_backend_port'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Port'),
      '#required' => TRUE,
      '#description' => $this->t('TCP port of the server running the Drupal site. Usually 80.'),
      '#default_value' => $config->get('backend_port'),
    );
    $form['config']['backend']['nodejs_config_backend_message_path'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Auth path'),
      '#description' => $this->t('Path on which the Drupal site listens for authentication check requests.'),
      '#default_value' => $config->get('backend_message_path'),
    );
    $form['config']['backend']['nodejs_config_debug'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Debug'),
      '#description' => $this->t('Show debug information from the node.js process.'),
      '#default_value' => $config->get('debug'),
    );
    $form['ext'] = array(
      '#type' => 'fieldset',
      '#title' => $this->t('Extensions'),
      '#description' => $this->t('An array of names of node.js modules that should be loaded as extensions to the
                                  node.js server.'),
    );
    $form['ext']['nodejs_config_extensions'] = array(
      '#type' => 'textarea',
      '#title' => $this->t('Extension file paths'),
      '#description' => $this->t('A list of node.js extension files paths, one per line.'),
      '#default_value' => $config->get('extensions'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $main_config = $this->configFactory->get('nodejs.config');

    $ext = $form_state->getValue('nodejs_config_extensions');
    if ($ext == !NULL) {
      $ext = explode("\n", str_replace("\r", '', $ext));
    }

    $array = array(
      'scheme' => $form_state->getValue('nodejs_server_scheme'),
      'host' => $form_state->getValue('nodejs_config_host'),
      'port' => (int) $form_state->getValue('nodejs_config_port'),
      'key' => $form_state->getValue('nodejs_config_key'),
      'cert' => $form_state->getValue('nodejs_config_cert'),
      'publishUrl' => $form_state->getValue('nodejs_config_publish_url'),
      'serviceKey' => $main_config->get('nodejs_service_key'),
      'backend' => array(
        'port' => (int) $form_state->getValue('nodejs_config_backend_port'),
        'host' => $form_state->getValue('nodejs_config_backend_host'),
        'messagePath' => $form_state->getValue('nodejs_config_backend_message_path'),
      ),
      'clientsCanWriteToChannels' => (bool) $form_state->getValue('nodejs_config_write_channels'),
      'clientsCanWriteToClients' => (bool) $form_state->getValue('nodejs_config_write_clients'),
      'extensions' => $ext,
      'debug' => (bool) $form_state->getValue('nodejs_config_debug'),
      'transports' => array(
        'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
      ),
      'jsMinification' => true,
      'jsEtag' => true,
      'logLevel' => 1
    );
    $output = 'backendSettings = ' . Json::encode($array);
    $output = str_replace(array('= {', ',', '}}', ':{', '\/'), array("= {\n  ", ",\n  ", "\n  }\n}", ":{\n  ",  '/'), $output);
    $output = "/**\n* This configuration file was built using the 'Node.js server configuration builder'.\n* For a more fully commented example see the file nodejs.config.js.example in the root of this module\n*/\n" . $output . ';';

    $this->configFactory->getEditable('nodejs_config.settings')
      ->set('js_suggestion', $output)
      ->set('host', $form_state->getValue('nodejs_config_host'))
      ->set('port', (int) $form_state->getValue('nodejs_config_port'))
      ->set('scheme', $form_state->getValue('nodejs_server_scheme'))
      ->set('key', $form_state->getValue('nodejs_config_key'))
      ->set('cert', $form_state->getValue('nodejs_config_cert'))
      ->set('publish_url', $form_state->getValue('nodejs_config_publish_url'))
      ->set('backend_port', (int) $form_state->getValue('nodejs_config_backend_port'))
      ->set('backend_host', $form_state->getValue('nodejs_config_backend_host'))
      ->set('backend_message_path', $form_state->getValue('nodejs_config_backend_message_path'))
      ->set('write_channels', (bool) $form_state->getValue('nodejs_config_write_channels'))
      ->set('write_clients', (bool) $form_state->getValue('nodejs_config_write_clients'))
      ->set('debug', (bool) $form_state->getValue('nodejs_config_debug'))
      ->set('extensions', $form_state->getValue('nodejs_config_extensions'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
   protected function getEditableConfigNames() {
     return ['nodejs_config.settings'];
   }

}
