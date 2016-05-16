{% macro default(type, content, loop) %}
{% import 'item-controls.html.swig' as item_control %}
{% import 'item-content.html.swig' as item_content %}
<div class="styleguide-item-group" id="{{type}}{{loop.index}}">
  <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
    <h3 class="styleguide-item-heading">{{content.title}}</h3>
    {{item_control.default(content)}}
  </div>{{item_content.default(type, content)}}
</div>
{% endmacro %}
