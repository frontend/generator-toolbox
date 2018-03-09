/* globals jQuery, document */

// You will use that file to import all your scripts
// Ex: import gallery from './gallery'<% if (svgIcons) { %>
import svgIcons from '../icons/svg-icons';

svgIcons(); // Must run as soon as possible<% } %>

const init = () => {
  // Run your imported scripts
  // Ex: gallery();
};

(function ($) {
  $(document).ready(() => init());
})(jQuery);
document.addEventListener('ToolboxReady', () => init());
