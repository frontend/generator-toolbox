<!-- fabricator menu -->
<div class="f-menu">

  {% include 'f-controls.html.swig' %}

  <ul>

    <li>
      <a href="index.html" class="f-menu__heading">Overview</a>
    </li>

    <li>
      <a href="atoms.html" class="f-menu__heading">Atoms</a>
      <ul>
        {% for atom in collections.atoms %}
          <li>
            <a href="atoms.html#atom{{loop.index}}">{{atom.title}}</a>
          </li>
        {% endfor %}
      </ul>
    </li>

    <li>
      <a href="molecules.html" class="f-menu__heading">Molecules</a>
      <ul>
        {% for molecule in collections.molecules %}
          <li>
            <a href="molecules.html#molecule{{loop.index}}">{{molecule.title}}</a>
          </li>
        {% endfor %}
      </ul>
    </li>

    <li>
      <a href="organisms.html" class="f-menu__heading">Organisms</a>
      <ul>
        {% for organism in collections.organisms %}
          <li>
            <a href="organisms.html#organism{{loop.index}}">{{organism.title}}</a>
          </li>
        {% endfor %}
      </ul>
    </li>

    <li>
      <span class="f-menu__heading">Pages</span>
      <ul>
        {% for page in collections.pages %}
          <li>
            <a href="{{page.title}}.html">{{page.title}}</a>
          </li>
        {% endfor %}
      </ul>
    </li>

  </ul>


</div>
<!-- /fabricator menu -->
