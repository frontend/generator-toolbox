// You will use that file to import all your scripts
// Ex: import gallery from './gallery'<% if (svgIcons) { %>
import svgIcons from '../icons/svg-icons';

svgIcons(); // Must run as soon as possible<% } %>

(function ($) {
  $(document).ready(function () {
    // Run your imported scripts
    // Ex: gallery();
  });
})(jQuery);
