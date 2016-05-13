{% extends "base.html.swig" %}

{% block content %}
  {% set path = '../../components/pages/' + title + '.html.swig' %}
  {% include path %}
{% endblock %}
