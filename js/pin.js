'use strict';

window.pin = (function () {
  var renderPin = function (ad) {
    var MapButtonTemplate = window.utils.template.querySelector('.pin-js');
    var MapPinElement = MapButtonTemplate.cloneNode(true);
    MapPinElement.style = 'left:' + ad.location.x + 'px; top:'
      + ad.location.y + 'px;';
    MapPinElement.querySelector('img').src = ad.author.avatar;
    MapPinElement.querySelector('img').alt = ad.offer.title;

    return MapPinElement;
  };

  var fillPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPin(data[i]));
    }
    document.querySelector('.map__pins').appendChild(fragment);
    var pins = document.querySelectorAll('.pin-js');
    for (i = window.utils.NUMBER_OF_PINS; i < pins.length; i++) {
      pins[i].classList.add('hidden');
    }
  };

  var receiveData = function () {
    var onLoad = function (data) {
      fillPins(data);
      for (var i = 0; i < data.length; i++) {
        window.utils.ads.push(data[i]);
      }
    };
    window.backend.load(onLoad, window.form.onError);
  };

  return {
    receiveData: receiveData
  };
})();
