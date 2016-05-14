{% extends "base.html.swig" %}

{% import 'styleguide/f-item.html.swig' as item %}

{% block content %}
  <div class="f-item-group" id="organisms">

  {% if collections.organisms.length > 0 %}
    <div class="f-item-heading-group">
      <h2 class="f-item-heading" data-f-toggle="labels">Organisms</h2>
      {{contents|raw}}
    </div>
    {% for organism in collections.organisms %}
      {{item.default('organism', organism, loop)}}
    {% endfor %}
  {% else %}
    <div class="f-item-heading-group" data-f-toggle="labels">
      <h2 class="f-item-heading">organisms</h2>
      {{contents|raw}}
    </div>
  {% endif %}

  </div>
{% endblock %}
