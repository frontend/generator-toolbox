{% macro default(type, content, loop) %}
{% import 'item-controls.html.swig' as item_control %}
{% import 'item-content.html.swig' as item_content %}
<div class="styleguide-item-group" id="{{content.name|lower}}">
  <div class="styleguide-item-heading-group" data-styleguide-toggle="labels">
    <h3 class="styleguide-item-heading"><a href="#{{content.name|lower}}">{{content.title}}</a></h3>
    {{item_control.default(content)}}
  </div>{{item_content.default(type, content)}}
</div>
{% endmacro %}
