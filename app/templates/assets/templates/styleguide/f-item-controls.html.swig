{% macro default(content) %}
  <div class="f-item-controls">
    {% if content.notes %}<span class="f-control f-icon" data-f-toggle-control="notes" title="Toggle Notes">
      <svg>
        <use xlink:href="#f-icon-notes" />
      </svg>
    </span>{% endif %}
    <span class="f-control f-icon" data-f-toggle-control="code" title="Toggle Code">
      <svg>
        <use xlink:href="#f-icon-code" />
      </svg>
    </span>
  </div>
{% endmacro %}
