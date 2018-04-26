'use strict';

window.pin = (function () {
  var renderPin = function (ad) {
    var MapButtonTemplate = window.globals.template.querySelectorAll('button')[1];
    var MapPinElement = MapButtonTemplate.cloneNode(true);
    MapPinElement.style = 'left:' + ad.location.x + 'px; top:'
      + ad['location']['y'] + 'px;';
    MapPinElement.querySelector('img').src = ad.author.avatar;
    MapPinElement.querySelector('img').alt = ad.offer.title;

    return MapPinElement;
  };

  return {
    fillPins: function () {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < window.globals.NUMBER_PINS; i++) {
        fragment.appendChild(renderPin(window.globals.ads[i]));
      }
      document.querySelector('.map__pins').appendChild(fragment);
    }
  };
})();
