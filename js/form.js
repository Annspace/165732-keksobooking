'use strict';

window.form = (function () {
// синхронизация типа жилья и цены за ночь
  var compareTypePrice = function (type) {
    var priceElem = document.getElementById('price');
    priceElem.placeholder = window.utils.TYPES_INFO[type].price;
    priceElem.min = window.utils.TYPES_INFO[type].price;
  };

  // синхронизация числа гостей и комнат
  var compareRoomsGuests = function (capVal, roomVal) {
    var capacity = document.getElementById('capacity');
    if (capVal !== 1 && roomVal === 1) {
      capacity.setCustomValidity('Для 1 гостя');
    } else if ((capVal === 0 || capVal === 3) && roomVal === 2) {
      capacity.setCustomValidity('Для 2 гостей или 1 гостя');
    } else if (capVal === 0 && roomVal === 3) {
      capacity.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
    } else if (capVal !== 0 && roomVal === 100) {
      capacity.setCustomValidity('не для гостей');
    } else {
      capacity.setCustomValidity('');
    }
  };
  // синхронизация времени отъезда/приезда
  var timeInOut = function (timeVal) {
    var timeIn = document.getElementById('timein');
    var timeOut = document.getElementById('timeout');
    timeIn.value = timeVal;
    timeOut.value = timeVal;
  };

  var onError = function (error) {
    error = window.utils.ERROR_TYPES[error] || 'Cтатус ответа: : ' + error;

    var errorDiv = document.querySelector('.error');
    errorDiv.textContent = error;
    errorDiv.classList.remove('hidden');

    setTimeout(function () {
      document.querySelector('.error').classList.add('hidden');
    }, 4000);
  };

  var setAddressField = function (pin) {
    var leftCoords = pin.style.left;
    var topCoords = pin.style.top;
    // поправка на острый конец
    var slicedLeft = Number(leftCoords.substring(0, leftCoords.length - window.utils.PX)) + window.utils.PIN_EDGE_LEFT;
    var slicedTop = Number(topCoords.substring(0, topCoords.length - window.utils.PX)) + window.utils.PIN_EDGE_TOP;
    window.utils.addressField.value = slicedLeft + ',' + slicedTop;

  };

  var synchronizeFields = function (e) {
    var capacity = document.getElementById('capacity');
    var room = document.getElementById('room_number');
    var type = document.getElementById('type');
    var timeIn = document.getElementById('timein');
    var timeOut = document.getElementById('timeout');
    switch (e.target) {
      case capacity || room:
        compareRoomsGuests(Number(capacity.value), Number(room.value));
        break;
      case type:
        compareTypePrice(e.target.value);
        break;
      case timeIn:
        timeInOut(e.target.value);
        break;
      case timeOut:
        timeInOut(e.target.value);
        break;
    }
  };

  var receiveData = function () {
    var onLoad = function (data) {
      window.pin.fillPins(data);
      for (var i = 0; i < window.utils.NUMBER_OF_PINS; i++) {
        window.utils.ads.push(data[i]);
      }
    };
    window.backend.load(onLoad, onError);
  };

  var sendData = function (evt) {
    evt.preventDefault();
    var FD = new FormData(window.utils.form);
    var data = FD;

    var onLoad = function () {
      window.utils.form.reset();
    };
    window.backend.send(data, onLoad, onError);
  };

  var filter = function () {
    var pins = document.querySelectorAll('.pin');
    var featuresElements = document.querySelectorAll('input[name = "features"]');

    var filteredAds = window.utils.ads.filter(function (value) {

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
      var filterByFeatures = [].filter.call(featuresElements, function (it) {
        return it.checked && (value.offer.features.indexOf(it.value) === (-1));
      });
      var featuresFilter = (filterByFeatures.length === 0);

      return typeFilter && priceFilter && roomsFilter && guestsFilter && featuresFilter;
    });

    var slicedPinLocationX = [].map.call(pins, function (it) { // делаем так для node elements
      return Number(it.parentNode.style.left.substring(0, it.parentNode.style.left.length - window.utils.PX));
    });

    var slicedPinLocationY = [].map.call(pins, function (it) { // делаем так для node elements
      return Number(it.parentNode.style.top.substring(0, it.parentNode.style.top.length - window.utils.PX));
    });

    // сравнить pins и отфильтрованные объявления, для совпадающих убрать hidden
    for (var i = 0; i < pins.length; i++) {
      pins[i].parentNode.classList.add('hidden');
      for (var k = 0; k < filteredAds.length; k++) {
        if (slicedPinLocationY[i] === filteredAds[k].location.y && slicedPinLocationX[i] === filteredAds[k].location.x) {
          pins[i].parentNode.classList.remove('hidden');
        }
      }
    }
  };

  var debounceFilters = function () {
    window.debounce(filter);
  };

  return {
    setAddressField: setAddressField,
    synchronizeFields: synchronizeFields,
    receiveData: receiveData,
    sendData: sendData,
    filter: filter,
    debounceFilters: debounceFilters
  };
})();
