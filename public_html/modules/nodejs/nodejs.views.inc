<?php

/**
 * @file
 * Provide views data for nodejs.module.
 */

/**
 * Implements hook_views_data().
 */
function nodejs_views_data() {

  $data['nodejs_presence']['table']['group']  = t('User presense');

  $data['nodejs_presence']['table']['join'] = array(
    'users_field_data' => array(
      'left_field' => 'uid',
      'field' => 'uid',
    ),
  );

  $data['nodejs_presence']['uid'] = array(
    'title' => t('UID'),
    'help' => t('The user ID available in the presense table.'),
    'field' => array(
      'id' => 'numeric',
    ),
    'filter' => array(
      'id' => 'numeric',
    ),
    'argument' => array(
      'id' => 'numeric',
    ),
    'relationship' => array(
      'title' => t('User presense'),
      'help' => t('The user available in the presense table.'),
      'base' => 'users',
      'base field' => 'uid',
      'id' => 'standard',
    ),
  );

  $data['nodejs_presence']['login_time'] = array(
    'title' => t('Login time'),
    'help' => t('The most recent time the user has been logged in to Nodejs server.'),
    'field' => array(
      'id' => 'nodejs_presence_login_time',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'id' => 'date',
    ),
    'argument' => array(
      'id' => 'date',
    ),
    'sort' => array(
      'id' => 'standard',
    ),
  );

  return $data;
}
