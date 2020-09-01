<?php

namespace Drupal\zurb_foundation\Plugin\Layout;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Layout\LayoutDefault;

/**
 * Layout class for all Foundation layouts.
 */
class FoundationLayout extends LayoutDefault {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return parent::defaultConfiguration() + [
      'css_id' => '',
      'css_classes' => ''
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);
    $configuration = $this->getConfiguration();

    $form['css_classes'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Classes'),
      '#description' => $this->t('Add classes to the outer wrapper element.'),
      '#default_value' => $configuration['css_classes'],
      '#weight' => 1
    ];

    $form['css_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Id'),
      '#description' => $this->t('Add an id to the outer wrapper element.'),
      '#default_value' => $configuration['css_id'],
      '#weight' => 2
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $defaults = $this->defaultConfiguration();
    $this->configuration['css_classes'] = $form_state->getValue('css_classes', $defaults['css_classes']);
    $this->configuration['css_id'] = $form_state->getValue('css_id', $defaults['css_id']);
  }

}
