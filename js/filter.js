'use strict';

window.filter = (function () {
  var filterByParams = function (value) {
    var typeFilter = (window.utils.params[0].value === 'any') || (value.offer.type === window.utils.params[0].value);

    var priceFilter;
    switch (window.utils.params[1].value) {
      case 'any':
        priceFilter = true;
        break;
      case 'middle':
        priceFilter = (value.offer.price >= 10000) && (value.offer.price <= 50000);
        break;
      case 'low':
        priceFilter = (value.offer.price < 10000);
        break;
      case 'high':
        priceFilter = (value.offer.price > 50000);
        break;
    }

    var roomsFilter = (window.utils.params[2].value === 'any') || (value.offer.rooms === Number(window.utils.params[2].value));
    var guestsFilter = (window.utils.params[3].value === 'any') || (value.offer.guests === Number(window.utils.params[3].value));

    // вернет такие features, у которых стоит галочка и они не содержатся в объявлении (рассматривается только "плохой" случай)
    var filterByFeatures = [].filter.call(window.utils.featuresElements, function (feature) {
      return feature.checked && (value.offer.features.indexOf(feature.value) === (-1));
    });
    var featuresFilter = (filterByFeatures.length === 0);

    return typeFilter && priceFilter && roomsFilter && guestsFilter && featuresFilter;
  };

  // сравнить pins и отфильтрованные объявления, для совпадающих убрать hidden
  var comparePinsAds = function (pins, ads) {

    var slicedPinLocationX = [].map.call(pins, function (pin) { // делаем так для node elements
      return Number(pin.parentNode.style.left.substring(0, pin.parentNode.style.left.length - window.utils.PX));
    });

    var slicedPinLocationY = [].map.call(pins, function (pin) { // делаем так для node elements
      return Number(pin.parentNode.style.top.substring(0, pin.parentNode.style.top.length - window.utils.PX));
    });

    for (var i = 0; i < pins.length; i++) {
      pins[i].parentNode.classList.add('hidden');
      for (var k = 0; k < ads.length; k++) {
        if (slicedPinLocationY[i] === ads[k].location.y &&
          slicedPinLocationX[i] === ads[k].location.x) {
          pins[i].parentNode.classList.remove('hidden');
        }
      }
    }
  };

  var filterPins = function () {
    var pins = document.querySelectorAll('.pin');
    var filteredAds = window.utils.ads.filter(filterByParams);
    comparePinsAds(pins, filteredAds);
  };

  var filterComplete = function () {
    window.utils.debounce(filterPins);
  };

  return {
    filterComplete: filterComplete
  };
})();
