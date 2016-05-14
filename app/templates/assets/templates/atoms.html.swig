{% extends "base.html.swig" %}

{% import 'styleguide/f-item.html.swig' as item %}

{% block content %}
  <div class="f-item-group" id="atoms">

  {% if collections.atoms.length > 0 %}
    <div class="f-item-heading-group">
      <h2 class="f-item-heading" data-f-toggle="labels">Atoms</h2>
      {{contents|raw}}
    </div>
    {% for atom in collections.atoms %}
      {{item.default('atom' ,atom, loop)}}
    {% endfor %}
  {% else %}
    <div class="f-item-heading-group" data-f-toggle="labels">
      <h2 class="f-item-heading">Atoms</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
