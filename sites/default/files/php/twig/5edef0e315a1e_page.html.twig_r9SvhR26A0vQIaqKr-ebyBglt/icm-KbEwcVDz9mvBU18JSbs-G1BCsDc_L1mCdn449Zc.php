<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* themes/drupal8_zymphonies_theme/templates/layout/page.html.twig */
class __TwigTemplate_442ef49b1110f65c5439de536275b5634b6d46f8e02f2ebb612503990f93edc5 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $tags = ["if" => 74, "for" => 95];
        $filters = ["escape" => 75, "raw" => 96];
        $functions = [];

        try {
            $this->sandbox->checkSecurity(
                ['if', 'for'],
                ['escape', 'raw'],
                []
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 60
        echo "

<!-- Header and Navbar -->
<header class=\"main-header\">
  <nav class=\"navbar navbar-default\" role=\"navigation\">
    <div class=\"container\">
      <div class=\"row\">
      <div class=\"navbar-header col-md-3\">
        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#main-navigation\">
          <span class=\"sr-only\">Toggle navigation</span>
          <span class=\"icon-bar\"></span>
          <span class=\"icon-bar\"></span>
          <span class=\"icon-bar\"></span>
        </button>
        ";
        // line 74
        if ($this->getAttribute(($context["page"] ?? null), "header", [])) {
            // line 75
            echo "          ";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "header", [])), "html", null, true);
            echo "
        ";
        }
        // line 77
        echo "      </div>

      <!-- Navigation -->
      <div class=\"col-md-9\">
        ";
        // line 81
        if ($this->getAttribute(($context["page"] ?? null), "primary_menu", [])) {
            // line 82
            echo "          ";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "primary_menu", [])), "html", null, true);
            echo "
        ";
        }
        // line 83
        echo "      
      </div>
      <!--End Navigation -->

      </div>
    </div>
  </nav>

  ";
        // line 91
        if ((($context["is_front"] ?? null) && ($context["show_slideshow"] ?? null))) {
            // line 92
            echo "    <div class=\"container\">
      <div class=\"flexslider\">
        <ul class=\"slides\">
          ";
            // line 95
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["slider_content"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["slider_contents"]) {
                // line 96
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->sandbox->ensureToStringAllowed($context["slider_contents"]));
                echo "
          ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['slider_contents'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 98
            echo "        </ul>
      </div>
    </div>
  ";
        }
        // line 102
        echo "
</header>
<!--End Header & Navbar -->


<!--Highlighted-->
  ";
        // line 108
        if ($this->getAttribute(($context["page"] ?? null), "highlighted", [])) {
            // line 109
            echo "    <div class=\"container\">
      <div class=\"row\">
        <div class=\"col-md-12\">
          ";
            // line 112
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "highlighted", [])), "html", null, true);
            echo "
        </div>
      </div>
    </div>
  ";
        }
        // line 117
        echo "<!--End Highlighted-->


<!-- Start Top Widget -->
";
        // line 121
        if ((($this->getAttribute(($context["page"] ?? null), "topwidget_first", []) || $this->getAttribute(($context["page"] ?? null), "topwidget_second", [])) || $this->getAttribute(($context["page"] ?? null), "topwidget_third", []))) {
            // line 122
            echo "  <div class=\"topwidget\">
    <!-- start: Container -->
    <div class=\"container\">
      
      <div class=\"row\">
        <!-- Top widget first region -->
        <div class = ";
            // line 128
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["topwidget_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 129
            if ($this->getAttribute(($context["page"] ?? null), "topwidget_first", [])) {
                // line 130
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "topwidget_first", [])), "html", null, true);
                echo "
          ";
            }
            // line 132
            echo "        </div>
        <!-- End top widget third region -->
        <!-- Top widget second region -->
        <div class = ";
            // line 135
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["topwidget_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 136
            if ($this->getAttribute(($context["page"] ?? null), "topwidget_second", [])) {
                // line 137
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "topwidget_second", [])), "html", null, true);
                echo "
          ";
            }
            // line 139
            echo "        </div>
        <!-- End top widget third region -->
        <!-- Top widget third region -->
        <div class = ";
            // line 142
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["topwidget_third_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 143
            if ($this->getAttribute(($context["page"] ?? null), "topwidget_third", [])) {
                // line 144
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "topwidget_third", [])), "html", null, true);
                echo "
          ";
            }
            // line 146
            echo "        </div>
        <!-- End top widget third region -->
      </div>
    </div>
  </div>
";
        }
        // line 152
        echo "<!--End Top Widget -->


<!-- Page Title -->
";
        // line 156
        if (($this->getAttribute(($context["page"] ?? null), "page_title", []) &&  !($context["is_front"] ?? null))) {
            // line 157
            echo "  <div id=\"page-title\">
    <div id=\"page-title-inner\">
      <!-- start: Container -->
      <div class=\"container\">
        ";
            // line 161
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "page_title", [])), "html", null, true);
            echo "
      </div>
    </div>
  </div>
";
        }
        // line 166
        echo "<!-- End Page Title -- >


<!-- layout -->
<div id=\"wrapper\">
  <!-- start: Container -->
  <div class=\"container\">
    
    <!--Content top-->
      ";
        // line 175
        if ($this->getAttribute(($context["page"] ?? null), "content_top", [])) {
            // line 176
            echo "        <div class=\"row\">
          ";
            // line 177
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "content_top", [])), "html", null, true);
            echo "
        </div>
      ";
        }
        // line 180
        echo "    <!--End Content top-->
    
    <!--start:content -->
    <div class=\"row\">
      <div class=\"col-md-12\">";
        // line 184
        echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "breadcrumb", [])), "html", null, true);
        echo "</div>
    </div>

    <div class=\"row layout\">
      <!--- Start Left SideBar -->
      ";
        // line 189
        if ($this->getAttribute(($context["page"] ?? null), "sidebar_first", [])) {
            // line 190
            echo "        <div class=\"sidebar\" >
          <div class = ";
            // line 191
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["sidebarfirst"] ?? null)), "html", null, true);
            echo " >
            ";
            // line 192
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "sidebar_first", [])), "html", null, true);
            echo "
          </div>
        </div>
      ";
        }
        // line 196
        echo "      <!---End Right SideBar -->

      <!--- Start content -->
      ";
        // line 199
        if ($this->getAttribute(($context["page"] ?? null), "content", [])) {
            // line 200
            echo "        <div class=\"content_layout\">
          <div class=";
            // line 201
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["contentlayout"] ?? null)), "html", null, true);
            echo ">
            ";
            // line 202
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "content", [])), "html", null, true);
            echo "
          </div>
        </div>
      ";
        }
        // line 206
        echo "      <!---End content -->

      <!--- Start Right SideBar -->
      ";
        // line 209
        if ($this->getAttribute(($context["page"] ?? null), "sidebar_second", [])) {
            // line 210
            echo "        <div class=\"sidebar\">
          <div class=";
            // line 211
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["sidebarsecond"] ?? null)), "html", null, true);
            echo ">
            ";
            // line 212
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "sidebar_second", [])), "html", null, true);
            echo "
          </div>
        </div>
      ";
        }
        // line 216
        echo "      <!---End Right SideBar -->
      
    </div>
    <!--End Content -->

    <!--Start Content Bottom-->
    ";
        // line 222
        if ($this->getAttribute(($context["page"] ?? null), "content_bottom", [])) {
            // line 223
            echo "      <div class=\"row\">
        ";
            // line 224
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "content_bottom", [])), "html", null, true);
            echo "
      </div>
    ";
        }
        // line 227
        echo "    <!--End Content Bottom-->
  </div>
</div>
<!-- End layout -->


<!-- Start Middle Widget -->
";
        // line 234
        if ((($this->getAttribute(($context["page"] ?? null), "middle_first", []) || $this->getAttribute(($context["page"] ?? null), "middle_second", [])) || $this->getAttribute(($context["page"] ?? null), "middle_third", []))) {
            // line 235
            echo "  <div class=\"middlewidget\">
    <!-- start: Container -->
    <div class=\"container\">
      
      <div class=\"row\">
        <!-- Top widget first region -->
        <div class = ";
            // line 241
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["middle_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 242
            if ($this->getAttribute(($context["page"] ?? null), "middle_first", [])) {
                // line 243
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "middle_first", [])), "html", null, true);
                echo "
          ";
            }
            // line 245
            echo "        </div>
        <!-- End top widget third region -->
        <!-- Top widget second region -->
        <div class = ";
            // line 248
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["middle_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 249
            if ($this->getAttribute(($context["page"] ?? null), "middle_second", [])) {
                // line 250
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "middle_second", [])), "html", null, true);
                echo "
          ";
            }
            // line 252
            echo "        </div>
        <!-- End top widget third region -->
        <!-- Top widget third region -->
        <div class = ";
            // line 255
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["middle_third_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 256
            if ($this->getAttribute(($context["page"] ?? null), "middle_third", [])) {
                // line 257
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "middle_third", [])), "html", null, true);
                echo "
          ";
            }
            // line 259
            echo "        </div>
        <!-- End top widget third region -->
      </div>
    </div>
  </div>
";
        }
        // line 265
        echo "<!--End Top Widget -->


<!-- Start bottom -->
";
        // line 269
        if ((($this->getAttribute(($context["page"] ?? null), "bottom_first", []) || $this->getAttribute(($context["page"] ?? null), "bottom_second", [])) || $this->getAttribute(($context["page"] ?? null), "bottom_third", []))) {
            // line 270
            echo "  <div class=\"bottom-widgets\">
    <!-- Start Container -->
    <div class=\"container\">
      
      <div class=\"row\">

        <!-- Start Bottom First Region -->
        <div class = ";
            // line 277
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["bottom_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 278
            if ($this->getAttribute(($context["page"] ?? null), "bottom_first", [])) {
                // line 279
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "bottom_first", [])), "html", null, true);
                echo "
          ";
            }
            // line 281
            echo "        </div>
        <!-- End Bottom First Region -->

        <!-- Start Bottom Second Region -->
        <div class = ";
            // line 285
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["bottom_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 286
            if ($this->getAttribute(($context["page"] ?? null), "bottom_second", [])) {
                // line 287
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "bottom_second", [])), "html", null, true);
                echo "
          ";
            }
            // line 289
            echo "        </div>
        <!-- End Bottom Second Region -->

        <!-- Start Bottom third Region -->
        <div class = ";
            // line 293
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["bottom_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 294
            if ($this->getAttribute(($context["page"] ?? null), "bottom_third", [])) {
                // line 295
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "bottom_third", [])), "html", null, true);
                echo "
          ";
            }
            // line 297
            echo "        </div>
        <!-- End Bottom Third Region -->

        <div class = ";
            // line 300
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["bottom_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 301
            if ($this->getAttribute(($context["page"] ?? null), "bottom_forth", [])) {
                // line 302
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "bottom_forth", [])), "html", null, true);
                echo "
          ";
            }
            // line 304
            echo "        </div>

      </div>
    </div>
  </div>
";
        }
        // line 310
        echo "<!--End Bottom -->


<!-- start: Footer -->
";
        // line 314
        if ((($this->getAttribute(($context["page"] ?? null), "footer_first", []) || $this->getAttribute(($context["page"] ?? null), "footer_second", [])) || $this->getAttribute(($context["page"] ?? null), "footer_third", []))) {
            // line 315
            echo "  <div class=\"footerwidget\">
    <div class=\"container\">
      
      <div class=\"row\">
        
        <!-- Start Footer First Region -->
        <div class = ";
            // line 321
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["footer_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 322
            if ($this->getAttribute(($context["page"] ?? null), "footer_first", [])) {
                // line 323
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "footer_first", [])), "html", null, true);
                echo "
          ";
            }
            // line 325
            echo "        </div>
        <!-- End Footer First Region -->

        <!-- Start Footer Second Region -->
        <div class = ";
            // line 329
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["footer_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 330
            if ($this->getAttribute(($context["page"] ?? null), "footer_second", [])) {
                // line 331
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "footer_second", [])), "html", null, true);
                echo "
          ";
            }
            // line 333
            echo "        </div>
        <!-- End Footer Second Region -->

        <!-- Start Footer third Region -->
        <div class = ";
            // line 337
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["footer_third_class"] ?? null)), "html", null, true);
            echo ">
          ";
            // line 338
            if ($this->getAttribute(($context["page"] ?? null), "footer_third", [])) {
                // line 339
                echo "            ";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "footer_third", [])), "html", null, true);
                echo "
          ";
            }
            // line 341
            echo "        </div>
        <!-- End Footer Third Region -->
      </div>
    </div>
  </div>
";
        }
        // line 347
        echo "<!--End Footer -->


<!-- Start Footer Menu -->
";
        // line 351
        if ($this->getAttribute(($context["page"] ?? null), "footer_menu", [])) {
            // line 352
            echo "  <div class=\"footer-menu\">
    <div class=\"container\">
      <div class=\"row\">
        <div class=\"col-sm-6 col-md-6\">
          ";
            // line 356
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "footer_menu", [])), "html", null, true);
            echo "
        </div>
        ";
            // line 358
            if (($context["show_social_icon"] ?? null)) {
                // line 359
                echo "        <div class=\"col-sm-6 col-md-6\">
          <div class=\"social-media\">
            ";
                // line 361
                if (($context["facebook_url"] ?? null)) {
                    // line 362
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["facebook_url"] ?? null)), "html", null, true);
                    echo "\"  class=\"facebook\" target=\"_blank\" ><i class=\"fab fa-facebook-f\"></i></a>
            ";
                }
                // line 364
                echo "            ";
                if (($context["google_plus_url"] ?? null)) {
                    // line 365
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["google_plus_url"] ?? null)), "html", null, true);
                    echo "\"  class=\"google-plus\" target=\"_blank\" ><i class=\"fab fa-google-plus-g\"></i></a>
            ";
                }
                // line 367
                echo "            ";
                if (($context["twitter_url"] ?? null)) {
                    // line 368
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["twitter_url"] ?? null)), "html", null, true);
                    echo "\" class=\"twitter\" target=\"_blank\" ><i class=\"fab fa-twitter\"></i></a>
            ";
                }
                // line 370
                echo "            ";
                if (($context["linkedin_url"] ?? null)) {
                    // line 371
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["linkedin_url"] ?? null)), "html", null, true);
                    echo "\" class=\"linkedin\" target=\"_blank\"><i class=\"fab fa-linkedin-in\"></i></a>
            ";
                }
                // line 373
                echo "            ";
                if (($context["pinterest_url"] ?? null)) {
                    // line 374
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["pinterest_url"] ?? null)), "html", null, true);
                    echo "\" class=\"pinterest\" target=\"_blank\" ><i class=\"fab fa-pinterest-p\"></i></a>
            ";
                }
                // line 376
                echo "            ";
                if (($context["rss_url"] ?? null)) {
                    // line 377
                    echo "              <a href=\"";
                    echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["rss_url"] ?? null)), "html", null, true);
                    echo "\" class=\"rss\" target=\"_blank\" ><i class=\"fas fa-rss\"></i></a>
            ";
                }
                // line 379
                echo "          </div>
        </div>
        ";
            }
            // line 382
            echo "      </div>
    </div>
  </div>
";
        }
        // line 386
        echo "<!-- End Footer Menu -->


";
        // line 389
        if ((($context["copyright_text"] ?? null) || ($context["show_credit_link"] ?? null))) {
            // line 390
            echo "<div class=\"copyright\">
  <div class=\"container\">
    <div class=\"row\">

      <!-- Copyright -->
      <div class=\"col-sm-6 col-md-6\">
        ";
            // line 396
            if (($context["copyright_text"] ?? null)) {
                echo "        
          <p>";
                // line 397
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["copyright_text"] ?? null)), "html", null, true);
                echo "</p>        
        ";
            }
            // line 399
            echo "      </div>
      <!-- End Copyright -->

      <!-- Credit link -->
      ";
            // line 403
            if (($context["show_credit_link"] ?? null)) {
                // line 404
                echo "        <div class=\"col-sm-6 col-md-6\">
          <p class=\"credit-link\">Designed by <a href=\"http://www.zymphonies.com\" target=\"_blank\">Zymphonies</a></p>
        </div>
      ";
            }
            // line 408
            echo "      <!-- End Credit link -->
      
    </div>
  </div>
</div>
";
        }
        // line 414
        echo "

<!-- Google map -->
";
        // line 417
        if ((($context["is_front"] ?? null) && $this->getAttribute(($context["page"] ?? null), "google_map", []))) {
            // line 418
            echo "  <div class=\"google_map\">
    ";
            // line 419
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed($this->getAttribute(($context["page"] ?? null), "google_map", [])), "html", null, true);
            echo "
  </div>
";
        }
        // line 422
        echo "<!-- End Google map -->";
    }

    public function getTemplateName()
    {
        return "themes/drupal8_zymphonies_theme/templates/layout/page.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  743 => 422,  737 => 419,  734 => 418,  732 => 417,  727 => 414,  719 => 408,  713 => 404,  711 => 403,  705 => 399,  700 => 397,  696 => 396,  688 => 390,  686 => 389,  681 => 386,  675 => 382,  670 => 379,  664 => 377,  661 => 376,  655 => 374,  652 => 373,  646 => 371,  643 => 370,  637 => 368,  634 => 367,  628 => 365,  625 => 364,  619 => 362,  617 => 361,  613 => 359,  611 => 358,  606 => 356,  600 => 352,  598 => 351,  592 => 347,  584 => 341,  578 => 339,  576 => 338,  572 => 337,  566 => 333,  560 => 331,  558 => 330,  554 => 329,  548 => 325,  542 => 323,  540 => 322,  536 => 321,  528 => 315,  526 => 314,  520 => 310,  512 => 304,  506 => 302,  504 => 301,  500 => 300,  495 => 297,  489 => 295,  487 => 294,  483 => 293,  477 => 289,  471 => 287,  469 => 286,  465 => 285,  459 => 281,  453 => 279,  451 => 278,  447 => 277,  438 => 270,  436 => 269,  430 => 265,  422 => 259,  416 => 257,  414 => 256,  410 => 255,  405 => 252,  399 => 250,  397 => 249,  393 => 248,  388 => 245,  382 => 243,  380 => 242,  376 => 241,  368 => 235,  366 => 234,  357 => 227,  351 => 224,  348 => 223,  346 => 222,  338 => 216,  331 => 212,  327 => 211,  324 => 210,  322 => 209,  317 => 206,  310 => 202,  306 => 201,  303 => 200,  301 => 199,  296 => 196,  289 => 192,  285 => 191,  282 => 190,  280 => 189,  272 => 184,  266 => 180,  260 => 177,  257 => 176,  255 => 175,  244 => 166,  236 => 161,  230 => 157,  228 => 156,  222 => 152,  214 => 146,  208 => 144,  206 => 143,  202 => 142,  197 => 139,  191 => 137,  189 => 136,  185 => 135,  180 => 132,  174 => 130,  172 => 129,  168 => 128,  160 => 122,  158 => 121,  152 => 117,  144 => 112,  139 => 109,  137 => 108,  129 => 102,  123 => 98,  114 => 96,  110 => 95,  105 => 92,  103 => 91,  93 => 83,  87 => 82,  85 => 81,  79 => 77,  73 => 75,  71 => 74,  55 => 60,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "themes/drupal8_zymphonies_theme/templates/layout/page.html.twig", "/home/u440403356/domains/unitic.net/public_html/themes/drupal8_zymphonies_theme/templates/layout/page.html.twig");
    }
}
