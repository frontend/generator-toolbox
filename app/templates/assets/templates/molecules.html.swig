{% extends "base.html.swig" %}

{% import 'styleguide/item.html.swig' as item %}

{% block content %}
  <div class="styleguide-item-group" id="molecules">

  {% if collections.molecules.length > 0 %}
    <div class="styleguide-item-heading-group">
      <h2 class="styleguide-item-heading" data-styleguide-toggle="labels">Molecules</h2>
      {{contents|raw}}
    </div>
    {% for molecule in collections.molecules %}
      {{item.default('molecule', molecule, loop)}}
    {% endfor %}
  {% else %}
    <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
      <h2 class="styleguide-item-heading">molecules</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
