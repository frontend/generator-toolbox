{% extends "base.html.swig" %}

{% import 'styleguide/item.html.swig' as item %}

{% block content %}
  <div class="styleguide-item-group" id="atoms">

  {% if collections.atoms.length > 0 %}
    <div class="styleguide-item-heading-group">
      <h2 class="styleguide-item-heading" data-styleguide-toggle="labels">Atoms</h2>
      {{contents|raw}}
    </div>
    {% for atom in collections.atoms %}
      {{item.default('atom' ,atom, loop)}}
    {% endfor %}
  {% else %}
    <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
      <h2 class="styleguide-item-heading">Atoms</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
