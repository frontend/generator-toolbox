{% extends "base.html.swig" %}

{% import 'styleguide/item.html.swig' as item %}

{% block content %}
  <div class="styleguide-item-group" id="atoms">

  {% if collections.atoms.length > 0 %}
    <div class="styleguide-item-heading-group">
      <div class="lead">{{contents|raw}}</div>
    </div>
    {% for atom in collections.atoms %}
      {{item.default('atom' ,atom, loop)}}
    {% endfor %}
  {% else %}
    <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
      <div class="lead">{{contents|raw}}</div>
    </div>
  {% endif %}

  </div>
{% endblock %}
