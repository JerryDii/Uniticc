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

/* themes/drupal8_zymphonies_theme/templates/block/block--system-branding-block.html.twig */
class __TwigTemplate_0611fd6333bc84fee80d16af46154a2669905a2693326a66ec27ee60f2c51370 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'content' => [$this, 'block_content'],
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $tags = ["set" => 16, "if" => 18];
        $filters = ["t" => 20, "escape" => 21];
        $functions = ["path" => 20];

        try {
            $this->sandbox->checkSecurity(
                ['set', 'if'],
                ['t', 'escape'],
                ['path']
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

    protected function doGetParent(array $context)
    {
        // line 1
        return "block.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 16
        $context["attributes"] = $this->getAttribute(($context["attributes"] ?? null), "addClass", [0 => "site-branding"], "method");
        // line 1
        $this->parent = $this->loadTemplate("block.html.twig", "themes/drupal8_zymphonies_theme/templates/block/block--system-branding-block.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 17
    public function block_content($context, array $blocks = [])
    {
        // line 18
        echo "  ";
        if (($context["site_logo"] ?? null)) {
            // line 19
            echo "    <div class=\"brand logo\">
      <a href=\"";
            // line 20
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("<front>"));
            echo "\" title=\"";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Home"));
            echo "\" rel=\"home\" class=\"site-branding__logo\">
        <img src=\"";
            // line 21
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["site_logo"] ?? null)), "html", null, true);
            echo "\" alt=\"";
            echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Home"));
            echo "\" />
      </a>
    </div>
  ";
        }
        // line 25
        echo "  ";
        if ((($context["site_name"] ?? null) || ($context["site_slogan"] ?? null))) {
            // line 26
            echo "    <div class=\"brand site-name\">
      ";
            // line 27
            if (($context["site_name"] ?? null)) {
                // line 28
                echo "        <div class=\"site-branding__name\">
          <a href=\"";
                // line 29
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("<front>"));
                echo "\" title=\"";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Home"));
                echo "\" rel=\"home\">";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["site_name"] ?? null)), "html", null, true);
                echo "</a>
        </div>
      ";
            }
            // line 32
            echo "      ";
            if (($context["site_slogan"] ?? null)) {
                // line 33
                echo "        <div class=\"site-branding__slogan\">";
                echo $this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["site_slogan"] ?? null)), "html", null, true);
                echo "</div>
      ";
            }
            // line 35
            echo "    </div>
  ";
        }
    }

    public function getTemplateName()
    {
        return "themes/drupal8_zymphonies_theme/templates/block/block--system-branding-block.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  121 => 35,  115 => 33,  112 => 32,  102 => 29,  99 => 28,  97 => 27,  94 => 26,  91 => 25,  82 => 21,  76 => 20,  73 => 19,  70 => 18,  67 => 17,  62 => 1,  60 => 16,  54 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "themes/drupal8_zymphonies_theme/templates/block/block--system-branding-block.html.twig", "/home/u440403356/domains/unitic.net/public_html/themes/drupal8_zymphonies_theme/templates/block/block--system-branding-block.html.twig");
    }
}
