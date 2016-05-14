{% macro default(type, content, loop) %}
{% import 'f-item-controls.html.swig' as item_control %}
{% import 'f-item-content.html.swig' as item_content %}
<div class="f-item-group" id="{{type}}{{loop.index}}">
  <div class="f-item-heading-group" data-f-toggle="labels">
    <h3 class="f-item-heading">{{content.title}}</h3>
    {{item_control.default(content)}}
  </div>{{item_content.default(type, content)}}
</div>
{% endmacro %}
