{% macro default(type, content) %}
  {% set path = '../../components/' + type + 's/' + content.title + '.html.swig' %}

  {% if content.notes %}<div class="f-item-notes" data-f-toggle="notes">
    {{content.notes|markdown|raw}}
  </div>{% endif %}
  <div class="f-item-preview">
    {% include path %}
  </div>
  <div class="f-item-code f-item-hidden" data-f-toggle="code">
    <pre><code class="language-markup">{% include path %}</code></pre>
  </div>
{% endmacro %}
