{% extends "base.html.swig" %}

{% block content %}
  {% if collection == 'docs' %}
    <div class="styleguide-page-container">
  {% endif %}
  {{contents|raw}}
  {% if collection == 'docs' %}
    </div>
  {% endif %}
{% endblock %}
