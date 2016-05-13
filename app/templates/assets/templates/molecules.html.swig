{% extends "base.html.swig" %}

{% import 'styleguide/f-item.html.swig' as item %}

{% block content %}
  <div class="f-item-group" id="molecules">

  {% if collections.molecules.length > 0 %}
    <div class="f-item-heading-group">
      <h2 class="f-item-heading" data-f-toggle="labels">Molecules</h2>
      {{contents|raw}}
    </div>
    {% for molecule in collections.molecules %}
      {{item.default('molecule', molecule, loop)}}
    {% endfor %}
  {% else %}
    <div class="f-item-heading-group" data-f-toggle="labels">
      <h2 class="f-item-heading">molecules</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
