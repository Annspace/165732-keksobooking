'use strict';

window.pin = (function () {
  var renderPin = function (ad) {
    var MapButtonTemplate = window.utils.template.querySelectorAll('button')[1];
    var MapPinElement = MapButtonTemplate.cloneNode(true);
    MapPinElement.style = 'left:' + ad.location.x + 'px; top:'
      + ad.location.y + 'px;';
    MapPinElement.querySelector('img').src = ad.author.avatar;
    MapPinElement.querySelector('img').alt = ad.offer.title;

    return MapPinElement;
  };

  var fillPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < window.utils.NUMBER_OF_PINS; i++) {
      fragment.appendChild(renderPin(data[i]));
    }
    document.querySelector('.map__pins').appendChild(fragment);
  };

  var receiveData = function () {
    var onLoad = function (data) {
      fillPins(data);
      for (var i = 0; i < window.utils.NUMBER_OF_PINS; i++) {
        window.utils.ads.push(data[i]);
      }
    };
    window.backend.load(onLoad, window.form.onError);
  };

  return {
    receiveData: receiveData
  };
})();
