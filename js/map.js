'use strict';

window.map = (function () {
  var makeMapActive = function () {
    [].forEach.call(window.utils.fields, function (it) {
      it.disabled = false;
    });
    [].forEach.call(window.utils.filtersElements, function (it) {
      it.disabled = false;
    });
    window.utils.map.classList.remove('map--faded');
    window.utils.form.classList.remove('ad-form--disabled');
    window.pin.receiveData();
  };


  // Метки и объявления связаны через координаты
  // если нашли метки и объявления с одинаковыми координатами, то добавляем соответствующее объявление в DOM
  // в первый раз просто добавляем объявление, последующие разы заменяем уже добавленное

  var showCurrentAd = function (currentPin, adsArray) {
    var slicedPinLocationY = Number(currentPin.parentNode.style.top.substring(0, currentPin.parentNode.style.top.length - window.utils.PX));
    var slicedPinLocationX = Number(currentPin.parentNode.style.left.substring(0, currentPin.parentNode.style.left.length - window.utils.PX));

    var pinAd = adsArray.filter(function (it) {
      return it.location.y === slicedPinLocationY && it.location.x === slicedPinLocationX;
    });

    if (document.querySelector('.map__card')) {
      var mapCardPopup = document.querySelector('.map__card');
      mapCardPopup.parentNode.replaceChild(window.card.renderAd(pinAd[0]), mapCardPopup);
    } else {
      var mapFilters = document.querySelector('.map__filters-container');
      mapFilters.parentNode.appendChild(window.card.renderAd(pinAd[0]));
    }
  };

  var closeAd = function () {
    var mapCardPopup = document.querySelector('.map__card');
    mapCardPopup.classList.add('hidden');
  };

  var makeMapInactive = function () {
    // привязываем контекст исполнения к массивоподобному объекту
    // заимствование метода у массива
    [].forEach.call(window.utils.fields, function (it) {
      it.disabled = true;
    });
    [].forEach.call(window.utils.filtersElements, function (it) {
      it.disabled = true;
    });
    window.utils.map.classList.add('map--faded');
    window.utils.form.classList.add('ad-form--disabled');
    window.utils.form.reset();
    window.utils.mapFilters.reset();
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').style.display = 'none';
    }
    window.utils.addressField.setAttribute('value', window.utils.START_X + ',' + window.utils.START_Y);
    var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].style.display = 'none';
      if (mapPins[i].classList.contains('map__pin--main')) {
        mapPins[i].style.display = 'block';
      }
    }
  };
  var adShowHide = function (e) {
    showCurrentAd(e.target, window.utils.ads);
    var buttonPin = e.target.parentNode;
    window.form.setAddressField(buttonPin);
  };

  // функции для обработчиков


  var clickHandler = function (e) {
    var clickedElem = e.target;
    if (clickedElem.classList.contains('pin')) {
      adShowHide(e);
    } else if (clickedElem.classList.contains('ad-form__reset')) {
      makeMapInactive(e);
    } else if (clickedElem.classList.contains('popup__close')) {
      closeAd();
    }
  };


  // если карта неактивна, то вызываем первую, если активна, то вторую
  var mouseUpHandler = function () {
    if (window.utils.map.classList.contains('map--faded')) {
      makeMapActive();
    } else {
      window.form.setAddressField(window.utils.pinMain);
    }
  };

  var dragAndDrop = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }; // для более частой перерисовки (16 fps) гладкое взаимодействие

      var top = window.utils.pinMain.offsetTop - shift.y;
      var left = window.utils.pinMain.offsetLeft - shift.x;
      var mapHeight = window.utils.map.offsetHeight;
      var mapWidth = window.utils.map.offsetWidth;

      if (top > 0 && top < (mapHeight - window.utils.PIN_MAIN_HEIGHT) && left > 0 && left < (mapWidth - window.utils.PIN_MAIN_WIDTH)) {
        window.utils.pinMain.style.top = top + 'px';
        window.utils.pinMain.style.left = left + 'px';
        window.form.setAddressField(window.utils.pinMain);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove); // на документ, а не на pinMain, т.к можно дернуть мышью за пределы pinMain
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Неактивность в момент открытия
  makeMapInactive();

  // Обработчики событий

  // Вызываемая функция подхватывает target и в зависимости от него запускает другие фунцкии
  document.addEventListener('click', clickHandler);
  document.addEventListener('change', window.form.synchronizeFields);
  // на случай если пользователь просто щелкнул по главной метке (без перетаскивания)
  window.utils.pinMain.addEventListener('mouseup', mouseUpHandler);
  window.utils.pinMain.addEventListener('mousedown', dragAndDrop);
  window.utils.form.addEventListener('submit', window.form.sendData);
  window.utils.mapFilters.addEventListener('change', window.filter.debounceFilters);
})();
