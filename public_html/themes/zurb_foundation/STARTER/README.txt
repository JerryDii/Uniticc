BUILD A CHILD THEME WITH ZURB FOUNDATION
----------------------------------------

The base Foundation theme is designed to be easily extended by its sub-themes.
You shouldn't modify any of the CSS or PHP files in the zurb_foundation/ folder;
but instead you should create a sub-theme of zurb_foundation which is located in
a folder outside of the root zurb_foundation/ folder. The examples below assume
zurb_foundation and your sub-theme will be installed in themes/,
but any valid theme directory is acceptable. Read the
sites/default/default.settings.php for more info.

This theme does not support IE7. If you need it downgrade to Foundation 2 see
http://foundation.zurb.com/docs/faq.php or use the script in the starter
template.php THEMENAME_preprocess_html function.

*** IMPORTANT NOTE ***
* After adding a new theme in Drupal 8, you'll need to clear the theme registry's
cache, which you can do by clearing all cache in the UI or running `drush cr` ,
if you have Drush installed.

Using Drush
-------------------------------

**Automatic drush sub-theme setup**

To create a sub-theme, simply run the Drush command `drush fst sub_theme`, where
"sub_theme" is the desired machine name of your sub-theme. Once a sub-theme is
created, you can enable it at /admin/appearance .

Then follow step 6 below to generate the necessary Foundation files that are not
included in the repository by default.

**Drush and Gulp**

The `gulpfile.js` includes drush commands that can be run every time scss/css
is updated. To use drush, edit the `config.js` file. In the `drush` option:

1. Set `enabled: false` to `enabled: true`
1. (Optional) Set the `drush_alias` variable.


Manual sub-theme setup
----------------------

 1. Setup the location for your new sub-theme.

    Copy the STARTER folder out of the zurb_foundation/ folder and rename it to
    be your new sub-theme. IMPORTANT: The name of your sub-theme must start with
    an alphabetic character and can only contain lowercase letters, numbers and
    underscores.

    For example, copy the themes/zurb_foundation/STARTER folder and
    rename it as themes/foo.

      Why? Each theme should reside in its own folder. To make it easier to
      upgrade Foundation, sub-themes should reside in a folder separate from the
      base theme.

 2. Setup the basic information for your sub-theme.

    In your new sub-theme folder, rename the STARTER.info.yml.txt file to include
    the name of your new sub-theme and remove the ".txt" extension. Then edit
    the .info file by editing the name and description field.

    For example, rename the foo/STARTER.info.yml.txt file to foo/foo.info.yml. Edit the
    foo.info.yml file and change "name: Foundation Sub-theme Starter" to
    "name: Foo" and "description: Read..." to "description: A sub-theme".

      Why? The .info.yml file describes the basic things about your theme: its
      name, description, features, template regions, and libraries.
      See the Drupal 8 Theme Guide for more info: https://www.drupal.org/theme-guide/8

    Then, visit your site's Appearance page at admin/appearance to refresh
    Drupal 8's cache of .info file data.

 3. Edit your sub-theme to use the proper function names.

    First, rename STARTER.theme to include the name of your new sub-theme. In this
    example we'll assume that it's renamed foo.theme.

    Edit the foo.theme and theme-settings.php files in your sub-theme's
    folder; replace ALL occurrences of "STARTER" with the name of your
    sub-theme.

    For example, edit foo/foo.theme and foo/theme-settings.php and replace
    every occurrence of "STARTER" with "foo".

    It is recommended to use a text editing application with search and
    "replace all" functionality.

 5. Set your website's default theme.

    Log in as an administrator on your Drupal site, go to the Appearance page at
    admin/appearance and click the "Enable and set default" link next to your
    new sub-theme.

 6. This theme uses npm which you will need to install as a prerequisite for
    developing your theme, although once in production it is not necessary for
    general use.

    Once you have ensured npm is installed, run this command at the root of
    your sub theme:
    - `npm install`

    Finally, run `gulp` to run the Sass compiler, or 'gulp watch' which
    will re-run every time you save a Sass file. Press Ctrl-C to break out of
    watching files.


Optional steps:

 7. Modify the markup in Foundation core theme's template files.

    If you decide you want to modify any of the .html.twig template files in the
    zurb_foundation folder, copy them to your sub-theme's folder before
    making any changes.And then rebuild the theme registry.

    For example, copy zurb_foundation/templates/page.html.twig to
    THEMENAME/templates/page.html.twig.

 8. Optionally override existing Drupal core *.html.twig templates in your sub-theme.

 9. Add custom css and js files to your sub-theme

    Rename STARTER.libraries.yml to the name of your sub-theme, un-commenting
    lines and making name changes as needed.

    You'll also need to edit your info.yml file to include your new library.
    There are instructions in the info.yml file to help you do this.

 9. Further extend your sub-theme.

    Discover further ways to extend your sub-theme by reading
    Drupal 8's Theme Guide online at: https://www.drupal.org/theme-guide/8
