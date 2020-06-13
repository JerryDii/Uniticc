<?php

use Drupal\Core\Link;

/**
 * Implements theme_menu_local_tasks().
 */
function zurb_foundation_menu_local_tasks(&$variables) {
  $output = '';

  if (!empty($variables['primary'])) {
    $variables['primary']['#prefix'] = '<h2 class="visually-hidden">' . t('Primary tabs') . '</h2>';
    $variables['primary']['#prefix'] .= '<div class="button-group">';
    $variables['primary']['#suffix'] = '</div>';
    $output .= \Drupal::service('renderer')->render($variables['primary']);
  }
  if (!empty($variables['secondary'])) {
    $variables['secondary']['#prefix'] = '<h2 class="visually-hidden">' . t('Secondary tabs') . '</h2>';
    $variables['secondary']['#prefix'] .= '<div class="button-group">';
    $variables['secondary']['#suffix'] = '</div>';
    $output .= \Drupal::service('renderer')->render($variables['secondary']);
  }

  return $output;
}

/**
 * Implements theme_preprocess_menu_local_task().
 */
function zurb_foundation_preprocess_menu_local_task(&$variables) {
  $link = $variables['element']['#link'];
  $link_text = [
    '#markup' => $link['title'],
  ];

  if (!empty($variables['element']['#active'])) {
    // Add text to indicate active tab for non-visual users.
    $link_text['#suffix'] = '<span class="visually-hidden">' . t('(active tab)') . '</span>';
  }

  $state = !empty($variables['element']['#active']) ? 'active' : 'secondary';
  $link['url']->setOption('attributes', ['class' => ['button', $state]]);
}

/**
 * Implements theme_preprocess_menu__off_canvas().
 *
 * Adds the appropriate submenu class to off canvas menus.
 */
function zurb_foundation_preprocess_menu__off_canvas(&$variables) {
  $blocks = \Drupal::service('block.repository')->getVisibleBlocksPerRegion();
  foreach (['left', 'right'] as $direction) {
    if (!empty($blocks[$direction . '_off_canvas'])) {
      foreach ($blocks[$direction . '_off_canvas'] as $block) {
        $plugin = $block->getPlugin();
        if ($plugin->getBaseId() == 'system_menu_block') {
          $menu_name = str_replace('-', '_', $plugin->getDerivativeId());
          if ($variables['theme_hook_original'] == 'menu__' . $menu_name) {
            $variables['attributes']['class'][] = $direction . '-submenu';
            break;
          }
        }
      }
    }
  }
}

/**
 * Implements theme_preprocess_menu().
 */
function zurb_foundation_preprocess_menu(&$variables) {
  $variables['attributes']['class'][] = 'menu';
}

/**
 * Implements theme_preprocess_menu__MENU_NAME().
 */
function zurb_foundation_preprocess_menu__main(&$variables) {
  if ($variables['top_bar'] = theme_get_setting('zurb_foundation_top_bar_enable')) {
    $top_bar_attributes = new \Drupal\Core\Template\Attribute();

    if (theme_get_setting('zurb_foundation_top_bar_grid')) {
      $top_bar_attributes->addClass('row column');
    }

    if (theme_get_setting('zurb_foundation_top_bar_sticky')) {
      $top_bar_attributes->addClass('sticky', 'large-12');
      $top_bar_attributes->setAttribute('data-sticky', TRUE);
      $top_bar_attributes->setAttribute('data-top-anchor', 'top-bar-sticky-container');
      // 9999999(px) is used as no other bottom anchor stopped the top-bar from
      // jumping back to the top of the screen after scrolling past 50% of the
      // screen. Super silly, but hours of work led to this.
      $top_bar_attributes->setAttribute('data-btm-anchor', 9999999);
      $top_bar_attributes->setAttribute('data-margin-top', 0);
      $top_bar_attributes->setAttribute('data-margin-bottom', 0);
      $top_bar_attributes->setAttribute('data-options', 'stickyOn:small');
      $variables['top_bar_sticky'] = TRUE;
    }

    if ($variables['top_bar'] == 2) {
      $top_bar_attributes->addClass('show-for-small');
    }

    $variables['top_bar_attributes'] = $top_bar_attributes;
    $variables['top_bar_menu_text'] = theme_get_setting('zurb_foundation_top_bar_menu_text');


    if ($back_text = theme_get_setting('zurb_foundation_top_bar_back_text')) {
      $variables['attributes']['data-back-button'] = "<li class=\"js-drilldown-back\"><a>{$back_text}</a></li>";
    }

    if (!theme_get_setting('zurb_foundation_top_bar_is_hover')) {
      $variables['attributes']['data-disable-hover'] = 'true';
    }

    // Format the linked site name.
    $site_name = \Drupal::config('system.site')->get('name');
    $title = strip_tags($site_name) . ' ' . t('Home');
    $url = \Drupal\Core\Url::fromRoute('<front>');
    $url->setOption('attributes', ['title' => $title]);

    $variables['linked_site_name'] = '';
    if (!empty($variables['site_name'])) {
      $variables['linked_site_name'] = Link::fromTextAndUrl($variables['site_name'], $url)->toString();
    }

    $variables['site_name'] = Link::fromTextAndUrl($site_name, $url)->toString();

    // Embed the search form inside the Top Bar.
    if (theme_get_setting('zurb_foundation_top_bar_search')) {
      if (\Drupal::moduleHandler()->moduleExists('search')) {
        $search_form = \Drupal::formBuilder()
          ->getForm('Drupal\search\Form\SearchBlockForm');

        // Wrap the search form in proper Top Bar classes.
        $search_form['#prefix'] = '<ul class="right"><li class="has-form">';
        $search_form['#suffix'] = '</ul></li>';

        $variables['top_bar_search'] = $search_form;
      }
    }

    // Embed the Language switcher inside the Top Bar.
    if (\Drupal::moduleHandler()->moduleExists('language')) {
      if (theme_get_setting('zurb_foundation_top_bar_languageswitcher')) {
        /** @var \Drupal\Core\Block\BlockManager $block_plugin_manager */
        $block_plugin_manager = \Drupal::service('plugin.manager.block');
        /** @var \Drupal\language\Plugin\Block\LanguageBlock $language_block */
        $language_block = $block_plugin_manager->createInstance('language_block:language_interface', []);
        $variables['top_bar_languageswitcher'] = $language_block->build();
      }
    }
  }
}
