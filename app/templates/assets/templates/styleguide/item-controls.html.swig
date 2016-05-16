{% macro default(content) %}
  <div class="styleguide-item-controls">
    {% if content.notes %}<span class="styleguide-control styleguide-icon" data-styleguide-toggle-control="notes" title="Toggle Notes">
      <svg>
        <use xlink:href="#styleguide-icon-notes" />
      </svg>
    </span>{% endif %}
    <span class="styleguide-control styleguide-icon" data-styleguide-toggle-control="code" title="Toggle Code">
      <svg>
        <use xlink:href="#styleguide-icon-code" />
      </svg>
    </span>
  </div>
{% endmacro %}
