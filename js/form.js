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
    if (capVal !== window.utils.ONE_GUEST && roomVal === window.utils.ONE_ROOM) {
      capacity.setCustomValidity('Для 1 гостя');
    } else if ((capVal === window.utils.NO_GUESTS || window.utils.THREE_GUESTS) && roomVal === window.utils.TWO_ROOMS) {
      capacity.setCustomValidity('Для 2 гостей или 1 гостя');
    } else if (capVal === window.utils.NO_GUESTS && roomVal === window.utils.THREE_ROOMS) {
      capacity.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
    } else if (capVal > window.utils.NO_GUESTS && roomVal === window.utils.HUNDRED_ROOMS) {
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
      case capacity:
      case room:
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

  var sendData = function (evt) {
    evt.preventDefault();
    var FD = new FormData(window.utils.form);
    var data = FD;

    var onLoad = function () {
      window.utils.form.reset();
      window.map.makeMapInactive();
    };
    window.backend.send(data, onLoad, onError);
  };

  return {
    setAddressField: setAddressField,
    synchronizeFields: synchronizeFields,
    onError: onError,
    sendData: sendData
  };
})();
