'use strict';

window.form = (function () {
// синхронизация типа жилья и цены за ночь
  var compareTypePrice = function (type) {
    var priceElem = document.getElementById('price');
    priceElem.placeholder = window.globals.TYPES_INFO[type].price;
    priceElem.min = window.globals.TYPES_INFO[type].price;
  };

  // синхронизация числа гостей и комнат
  var compareRoomsGuests = function (capVal, roomVal) {
    var capacity = document.getElementById('capacity');
    if (capVal !== 1 && roomVal === 1) {
      capacity.setCustomValidity('Для 1 гостя');
    } else if (capVal === (3 || 0) && roomVal === 2) {
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

  return {
    setAddressField: function (pin) {
      var leftCoords = pin.style.left;
      var topCoords = pin.style.top;
      // поправка на острый конец
      var slicedLeft = Number(leftCoords.substring(0, leftCoords.length - window.globals.PX)) + window.globals.PIN_EDGE_LEFT;
      var slicedTop = Number(topCoords.substring(0, topCoords.length - window.globals.PX)) + window.globals.PIN_EDGE_TOP;
      window.globals.addressField.setAttribute('value', slicedLeft + ',' + slicedTop);

    },
    synchronizeFields: function (e) {
      var capacity = document.getElementById('capacity');
      var room = document.getElementById('room_number');
      var type = document.getElementById('type');
      var timeIn = document.getElementById('timein');
      var timeOut = document.getElementById('timeout');
      switch (e.target) {
        case capacity:
          compareRoomsGuests(Number(e.target.value), Number(room.value));
          break;
        case room:
          compareRoomsGuests(Number(capacity.value), Number(e.target.value));
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
    }
  };
})();
