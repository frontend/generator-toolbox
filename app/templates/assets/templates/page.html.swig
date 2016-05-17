{% extends "base.html.swig" %}

{% block content %}
  {% set path = '../components/pages/' + name + '.html.swig' %}
  <div id="page-wrapper">
    {% include path %}
  </div>
{% endblock %}

{% block javascripts %}
<script>
  (function($){
    $(document).ready(function(){
      $('#page-wrapper').each(function(){
        var formatted = $(this).html().replace(/---[\s\S]*?---/g, '');
        $(this).html(formatted);
      });
    });
  }(jQuery));
</script>
{% endblock %}
