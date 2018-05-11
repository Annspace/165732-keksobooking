'use strict';

window.filters = (function () {
  var filterByParams = function (value) {
    var typeFilter = (window.utils.params[0].value === 'any') || (value.offer.type === window.utils.params[0].value);

    var priceFilter;
    switch (window.utils.params[1].value) {
      case 'any':
        priceFilter = true;
        break;
      case 'middle':
        priceFilter = (value.offer.price >= window.utils.MIN_PRICE) && (value.offer.price <= window.utils.MAX_PRICE);
        break;
      case 'low':
        priceFilter = (value.offer.price < window.utils.MIN_PRICE);
        break;
      case 'high':
        priceFilter = (value.offer.price > window.utils.MAX_PRICE);
        break;
    }

    var roomsFilter = (window.utils.params[2].value === 'any') || (value.offer.rooms === Number(window.utils.params[2].value));
    var guestsFilter = (window.utils.params[3].value === 'any') || (value.offer.guests === Number(window.utils.params[3].value));

    // вернет такие features, у которых стоит галочка и они не содержатся в объявлении (рассматривается только "плохой" случай)
    var filterByFeatures = [].filter.call(window.utils.features, function (feature) {
      return feature.checked && (value.offer.features.indexOf(feature.value) === (-1));
    });
    // если true, то всё ок
    var featuresFilter = (filterByFeatures.length === 0);

    return typeFilter && priceFilter && roomsFilter && guestsFilter && featuresFilter;
  };

  // сравнить pins и отфильтрованные объявления, для совпадающих убрать hidden
  var comparePinsAds = function (pins, ads) {

    var slicedPinLocationX = [].map.call(pins, function (pin) { // делаем так для node elements
      return Number(pin.style.left.substring(0, pin.style.left.length - window.utils.PX));
    });

    var slicedPinLocationY = [].map.call(pins, function (pin) { // делаем так для node elements
      return Number(pin.style.top.substring(0, pin.style.top.length - window.utils.PX));
    });

    for (var i = 0; i < pins.length; i++) {
      pins[i].classList.remove('filtered');
      for (var k = 0; k < ads.length; k++) {
        if (slicedPinLocationY[i] === ads[k].location.y &&
          slicedPinLocationX[i] === ads[k].location.x) {
          pins[i].classList.add('filtered');
        }
      }
    }
  };

  var filterPins = function () {
    var pins = window.utils.map.querySelectorAll('.pin-js');
    var filteredAds = window.utils.ads.filter(filterByParams);
    comparePinsAds(pins, filteredAds);
    // показываем отфильтрованные пины
    for (var i = 0; i < pins.length; i++) {
      pins[i].style.display = 'none';
      if (pins[i].classList.contains('filtered')) {
        pins[i].style.display = 'block';
      }
    }
    // среди отфильтрованных скрываем те, которые превышают 5
    var filteredPins = document.querySelectorAll('.filtered');
    if (filteredPins.length > window.utils.NUMBER_OF_PINS) {
      for (i = window.utils.NUMBER_OF_PINS; i < filteredPins.length; i++) {
        filteredPins[i].style.display = 'none';
      }
    }
  };

  var filterComplete = function () {
    var openedAd = window.utils.map.querySelector('.map__card');
    if (openedAd) {
      openedAd.classList.add('hidden');
    }
    window.utils.debounce(filterPins);
  };

  return {
    filterComplete: filterComplete
  };
})();
