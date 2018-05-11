'use strict';

(function () {
// синхронизация типа жилья и цены за ночь
  var compareTypePrice = function (type) {
    window.utils.price.placeholder = window.utils.TYPES_INFO[type].price;
    window.utils.price.min = window.utils.TYPES_INFO[type].price;
  };

  // синхронизация числа гостей и комнат
  var compareRoomsGuests = function (capVal, roomVal) {
    if (capVal !== window.utils.ONE_GUEST && roomVal === window.utils.ONE_ROOM) {
      window.utils.capacity.setCustomValidity('Для 1 гостя');
    } else if ((capVal === window.utils.NO_GUESTS || window.utils.THREE_GUESTS) && roomVal === window.utils.TWO_ROOMS) {
      window.utils.capacity.setCustomValidity('Для 2 гостей или 1 гостя');
    } else if (capVal === window.utils.NO_GUESTS && roomVal === window.utils.THREE_ROOMS) {
      window.utils.capacity.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
    } else if (capVal > window.utils.NO_GUESTS && roomVal === window.utils.HUNDRED_ROOMS) {
      window.utils.capacity.setCustomValidity('не для гостей');
    } else {
      window.utils.capacity.setCustomValidity('');
    }
  };
  // синхронизация времени отъезда/приезда
  var compareTimeInOut = function (timeVal) {
    window.utils.timeIn.value = timeVal;
    window.utils.timeOut.value = timeVal;
  };

  var onError = function (error) {
    error = window.utils.ERROR_TYPES[error] || 'Cтатус ответа: : ' + error;

    var errorDiv = document.querySelector('.error');
    errorDiv.textContent = error;
    errorDiv.classList.remove('hidden');

    setTimeout(function () {
      document.querySelector('.error').classList.add('hidden');
    }, window.utils.TIMEOUT_ERROR);
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
    switch (e.target) {
      case window.utils.capacity:
      case window.utils.room:
        compareRoomsGuests(Number(window.utils.capacity.value), Number(window.utils.room.value));
        break;
      case window.utils.type:
        compareTypePrice(e.target.value);
        break;
      case window.utils.timeIn:
      case window.utils.timeOut:
        compareTimeInOut(e.target.value);
        break;
    }
  };

  var sendData = function (evt) {
    evt.preventDefault();
    var FD = new FormData(window.utils.formAd);
    var data = FD;

    var onLoad = function () {
      window.utils.formAd.reset();
      window.map.makeMapInactive();
      document.querySelector('.success').classList.remove('hidden');
    };
    window.backend.sendLoadData(onLoad, onError, data);
  };

  window.form = {
    setAddressField: setAddressField,
    synchronizeFields: synchronizeFields,
    onError: onError,
    sendData: sendData
  };
})();
