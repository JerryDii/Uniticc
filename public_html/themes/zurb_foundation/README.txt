ZURB FOUNDATION 6 - DRUPAL 8 RELEASE
====================================

Getting Started
---------------

At the time of this writing, Twig is integrated into Drupal 8 core but a lot of
theme function / render function cleanup remains. We are working diligently to
keep up with Drupal 8 and Foundation 6 development.

See STARTER/README.txt for how to create a starter theme using this base theme.

Zurb Foundation 6 has switched from compass to npm and gulp for
dependency management and generating CSS from scss files.

Foundation Docs
---------------

Examples of Foundation markup can be found here:
http://foundation.zurb.com/docs/
Drupal-specific zurb_foundation theme documentation is here:
https://www.drupal.org/node/1948260

Installing npm
------------------------

NodeJS with included node package manager (npm) is required to build the site
dependencies. Download from https://nodejs.org/ . Mac OS X users can install
nodejs with homebrew ( http://brew.sh/ ) for streamlined version updates.

If all went well during installation, you should be able to type this at
the command line, from inside the theme directory:

`npm install`

This will install the latest versions of Zurb Foundation and its interaction
library, motion-ui, into the theme.

Dependencies
------------

After everything is installed, Zurb Foundation theme dependencies are managed
with composer.json and package.json.

This manages dependencies and their versions for Foundation core and addons.

If you need to generate a theme with a different incremental version of
foundation or motion-ui, edit these version strings in package.json:

  "devDependencies": {
    "foundation-sites": "~6.4.3",
    "motion-ui": "~1.2.2",
  },

Then running `npm start` will copy the new files from dist to the production
directories.

Installing this theme
---------------------

To install Zurb Foundation, copy zurb_foundation into the root-level themes
directory, or into a sites/*/themes directory, as zurb_foundation.

Once copied, after npm has ran its installer, you can enable
the theme by visiting "/admin/appearance" and clicking
"Install and set as default" under the ZURB Foundation block.

Once installed, you can visit /admin/appearance/settings/zurb_foundation to
configure the theme.

If you do not want to develop a child theme, use `npm start` to copy dist files
into the appropriate css and js folders, then it will watch /scss for changes.
Press ctrl-C to break the watcher. (Note, it is recommended to build a child
theme for better maintainability)

How to Use Zurb Foundation
--------------------------

# Creating a Sub-theme

To create a sub-theme automatically, simply run the Drush command
`drush fst sub_theme`, where "sub_theme" is the desired machine name of your
sub-theme. Once a sub-theme is created, you can enable it at /admin/appearance .

Detailed sub-theme documentation can be found in the README.txt file included in
your new sub-theme (distributed inside STARTERKIT).

The code controlling drush is at /inc/zurb_foundation.drush.inc .

# Theme Settings

At /admin/appearance/settings/zurb_foundation, there are a variety of Zurb
Foundation specific settings you can use to configure and enable theme features.
There are descriptions of each setting and setting group on that page.

The most popular feature by far is the Top Bar, which can be enabled under
"FOUNDATION TOP BAR". This setting will theme the Drupal-provided "Main Menu" as
a Foundation Top Bar, which can be stickied to the top of a page and supports
deep menu nesting.

# The Off Canvas and Meta Header Regions

Zurb Foundation for Drupal 8 provides some new regions compared to the Drupal 7
branches.

There are now two off canvas regions, left_off_canvas and right_off_canvas, that
can be used to display content off screen. The most common use for this is
menus, and as such we've worked to theme any menu block placed in an off canvas
region using the appropriate Foundation styles. Nesting is supported, but the
parent menu link will be used as a button to move to the next menu level, and
cannot also link to a page. Here's an example menu structure for this:

- Main (<front>)
- Information (#)
-- About Us (/node/1)
-- Contact Us (/contact)
--- Locations (#)
---- Boston (/locations/boston)
---- Portland (/locations/portland)
- Your Account (/user)

In this example, the menu links at the top of a new tree (Information,
Locations) will simply open up a new menu level.

To expand an off canvas region, simply create a content block with HTML like:

"<button class="button" data-toggle="left-off-canvas-menu" type="button">
  Open Menu
</button>"

More examples of this can be seen at:
http://foundation.zurb.com/sites/docs/off-canvas.html

Lastly, we also provide a Meta Header region, which can be used to place blocks
above all other page regions. This is most useful for the Main Menu block,
which can be then rendered as a Top Bar.

Responsive Images
-----------------

The breakpoints file (zurb_foundation.breakpoints.yml) is only needed if you are
creating images with different aspect ratios (art direction) for different size
screens, e.g. when you need to use the "picture" element. If you are merely sending
different resolution images, then you want to use srcset, because the browser is
choosing the image and then you don't need the breakpoints file.

Please see the following for more information on responsive images:
https://www.drupal.org/project/zurb_foundation/issues/2958265

Known Issues
------------

If you encounter gulp problems on a Windows machine similar to this: "Error: 
ENOTSUP: operation not supported on socket, scandir
'T:\drivepath\scss\_settings.scss'" please refer to this issue:
https://www.drupal.org/project/zurb_foundation/issues/2906167
Updating to some version of Gulp 4 improves the situation per reports.


Developer Notes
---------------

This branch is still in active development. Foundation 6 replaced grunt scripts
with gulp. See STARTER/README.txt for more info on how to work with npm and gulp
to compile sass in your child theme.

Problems? Search the issue queue for help here:
https://www.drupal.org/project/issues/zurb_foundation?status=All&categories=All
