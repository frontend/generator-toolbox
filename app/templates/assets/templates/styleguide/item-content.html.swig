{% macro default(type, content) %}
  {% set path = '../../components/' + type + 's/' + content.name + '.html.swig' %}

  {% if content.notes %}<div class="styleguide-item-notes" data-styleguide-toggle="notes">
    {{content.notes|markdown|raw}}
  </div>{% endif %}
  <div class="styleguide-item-preview">
    {% include path %}
  </div>
  <div class="styleguide-item-code styleguide-item-hidden" data-styleguide-toggle="code">
    <pre><code class="language-markup">{% include path %}</code></pre>
  </div>
{% endmacro %}
