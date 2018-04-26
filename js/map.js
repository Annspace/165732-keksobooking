'use strict';

window.map = (function () {
  var makeMapActive = function () {
    var fields = document.querySelectorAll('fieldset');
    var adForm = document.querySelector('.ad-form');
    window.data.generateAds();
    window.pin.fillPins();
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = false;
    }
    window.globals.map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
  };


  // Метки и картинки связаны через src картинок
  // Обрезаем src картинки до img/avatars/user*.png , ищем такой же src у картинок
  // из набора ads, если нашли картинки с одинаковыми src, то добавляем соответствующий ad в DOM
  // в первый раз просто добавляем ad, последующие разы заменяем уже добавленный
  // отрезаем с конца (последние 10 символов)

  var showCurrentAd = function (currentPin, adsArray) {
    var slicedCurrentPin = currentPin.src.substring(currentPin.src.length - window.globals.LENGTH_OF_NAME, currentPin.src.length);
    for (var i = 0; i < adsArray.length; i++) {
      window.globals.avatars[i] = adsArray[i]['author']['avatar'];
      var slicedAdAvatar = window.globals.avatars[i].substring(window.globals.avatars[i].length - window.globals.LENGTH_OF_NAME, window.globals.avatars[i].length);
      if (slicedAdAvatar === slicedCurrentPin) {
        if (document.querySelector('.map__card')) {
          var mapCardPopup = document.querySelector('.map__card');
          mapCardPopup.parentNode.replaceChild(window.card.renderAd(window.globals.ads[i]), mapCardPopup);
          break;
        } else {
          var mapFilters = document.querySelector('.map__filters-container');
          mapFilters.parentNode.appendChild(window.card.renderAd(window.globals.ads[i]));
          break;
        }
      }
    }
  };

  var closeAd = function () {
    var mapCardPopup = document.querySelector('.map__card');
    mapCardPopup.classList.add('hidden');
  };

  var makeMapInactive = function () {
    var fields = document.querySelectorAll('fieldset');
    var adForm = document.querySelector('.ad-form');
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = true;
    }
    window.globals.map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').style.display = 'none';
    }
    window.globals.addressField.setAttribute('value', window.globals.START_X + ',' + window.globals.START_Y);
    var mapPins = document.querySelectorAll('.map__pin');
    for (i = 0; i < mapPins.length; i++) {
      mapPins[i].style.display = 'none';
      if (mapPins[i].classList.contains('map__pin--main')) {
        mapPins[i].style.display = 'block';
      }
    }
  };
  var adShowHide = function (e) {
    showCurrentAd(e.target, window.globals.ads);
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
    if (window.globals.map.classList.contains('map--faded')) {
      makeMapActive();
    } else {
      window.form.setAddressField(window.globals.pinMain);
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

      var top = window.globals.pinMain.offsetTop - shift.y;
      var left = window.globals.pinMain.offsetLeft - shift.x;
      var mapHeight = window.globals.map.offsetHeight;
      var mapWidth = window.globals.map.offsetWidth;

      if (top > 0 && top < (mapHeight - window.globals.PIN_MAIN_HEIGHT) && left > 0 && left < (mapWidth - window.globals.PIN_MAIN_WIDTH)) {
        window.globals.pinMain.style.top = top + 'px';
        window.globals.pinMain.style.left = left + 'px';
        window.form.setAddressField(window.globals.pinMain);
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
  window.globals.pinMain.addEventListener('mouseup', mouseUpHandler);
  window.globals.pinMain.addEventListener('mousedown', dragAndDrop);
})();
