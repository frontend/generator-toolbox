<?php
  $drush_ignore_modules = array(
    'devel',
    'webprofiler',
    'devel_generate',
    'kint',
    'yaml_editor',
  );
  $command_specific['config-export']['skip-modules'] = $drush_ignore_modules;
  $command_specific['config-import']['skip-modules'] = $drush_ignore_modules;
