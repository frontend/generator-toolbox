const svgIcons = () => {
  const ajax = new XMLHttpRequest();
  const svgPath = window.svgPath || 'icons/icons.svg';
  ajax.open('GET', svgPath, true);
  ajax.send();
  ajax.onload = function (e) {
    var div = document.createElement('div');
    div.innerHTML = ajax.responseText;
    if (ajax.status === 200) {
      document.body.insertBefore(div, document.body.childNodes[0]);
    }
  };
};

export default svgIcons;
