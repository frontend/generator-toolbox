{% extends "base.html.swig" %}

{% block content %}
  <h1>{{title}}</h1>
  {{contents|raw}}
{% endblock %}
