{% extends "base.html.swig" %}

{% import 'styleguide/item.html.swig' as item %}

{% block content %}
  <div class="styleguide-item-group" id="organisms">

  {% if collections.organisms.length > 0 %}
    <div class="styleguide-item-heading-group">
      <h2 class="styleguide-item-heading" data-styleguide-toggle="labels">Organisms</h2>
      {{contents|raw}}
    </div>
    {% for organism in collections.organisms %}
      {{item.default('organism', organism, loop)}}
    {% endfor %}
  {% else %}
    <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
      <h2 class="styleguide-item-heading">organisms</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
