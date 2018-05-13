'use strict';

(function () {

  // если активны, сделать неактивными
  var switchFields = function (fields) {
    [].forEach.call(fields, function (it) {
      it.disabled = !it.disabled;
    });
  };

  var makeMapActive = function () {
    switchFields(window.utils.fields);
    switchFields(window.utils.params);
    window.utils.map.classList.remove('map--faded');
    window.utils.formAd.classList.remove('ad-form--disabled');
    window.utils.price.setAttribute('min', '1000');
    window.utils.price.setAttribute('placeholder', '1000');
    window.pin.receiveData();
    var mapPins = window.utils.map.querySelectorAll('.pin-js');
    // не более пяти меток
    if (mapPins.length > window.utils.NUMBER_OF_PINS) {
      for (var i = 0; i < window.utils.NUMBER_OF_PINS; i++) {
        mapPins[i].style.display = 'block';
      }
    }
  };


  // Метки и объявления связаны через координаты
  // если нашли метки и объявления с одинаковыми координатами, то добавляем соответствующее объявление в DOM
  // в первый раз просто добавляем объявление, последующие разы заменяем уже добавленное

  var showCurrentAd = function (currentPin, adsArray) {
    var slicedPinLocationY = Number(currentPin.style.top.substring(0, currentPin.style.top.length - window.utils.PX));
    var slicedPinLocationX = Number(currentPin.style.left.substring(0, currentPin.style.left.length - window.utils.PX));

    var pinAd = adsArray.filter(function (it) {
      return it.location.y === slicedPinLocationY && it.location.x === slicedPinLocationX;
    });

    if (window.utils.map.querySelector('.map__card')) {
      var mapCardPopup = window.utils.map.querySelector('.map__card');
      mapCardPopup.parentNode.replaceChild(window.card.renderAd(pinAd[0]), mapCardPopup);
    } else {
      window.utils.formFilters.parentNode.appendChild(window.card.renderAd(pinAd[0]));
    }
  };

  var closeAd = function () {
    var mapCardPopup = window.utils.map.querySelector('.map__card');
    mapCardPopup.classList.add('hidden');
  };

  var makeMapInactive = function () {
    // привязываем контекст исполнения к массивоподобному объекту
    // заимствование метода у массива
    window.utils.ads = [];
    switchFields(window.utils.fields);
    switchFields(window.utils.params);
    window.utils.map.classList.add('map--faded');
    window.utils.formAd.classList.add('ad-form--disabled');
    window.utils.formAd.reset();
    window.utils.formFilters.reset();
    if (window.utils.map.querySelector('.map__card')) {
      window.utils.map.querySelector('.map__card').style.display = 'none';
    }
    window.utils.addressField.setAttribute('value', window.utils.START_X + ',' + window.utils.START_Y);
    var mapPins = window.utils.map.querySelectorAll('.map__pin');
    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].style.display = 'none';
      mapPins[i].classList.remove('filtered');
      if (mapPins[i].classList.contains('map__pin--main')) {
        mapPins[i].style.display = 'block';
        mapPins[i].style.left = window.utils.PIN_MAIN_START_LEFT + 'px';
        mapPins[i].style.top = window.utils.PIN_MAIN_START_TOP + 'px';
      }
    }
    window.utils.price.removeAttribute('min');
    window.utils.price.removeAttribute('placeholder');
    var preview = window.utils.formAd.querySelector('.ad-form-header__preview img');
    preview.setAttribute('src', window.utils.DEFAULT_AVATAR);
    var photos = window.utils.formAd.querySelectorAll('.ad-form__photo');
    for (i = 1; i < photos.length; i++) {
      photos[i].parentNode.removeChild(photos[i]);
    }
    // показать серый квадратик в картинках
    photos[0].style.display = 'block';
    document.removeEventListener('keydown', onEscPress);
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_BUTTON) {
      closeAd();
    }
  };

  var showAd = function (pinButton) {
    showCurrentAd(pinButton, window.utils.ads);
    document.addEventListener('keydown', onEscPress);
    window.form.setAddressField(pinButton);
  };

  // функции для обработчиков


  var clickHandler = function (e) {
    var clickedElem = e.target;
    if (clickedElem.classList.contains('pin-js')) {
      showAd(clickedElem);
    } else if (clickedElem.parentNode !== document && clickedElem.parentNode.classList.contains('pin-js')) {
      showAd(clickedElem.parentNode);
    } else if (clickedElem.classList.contains('ad-form__reset')) {
      makeMapInactive();
    } else if (clickedElem.classList.contains('popup__close')) {
      closeAd();
    }
  };


  // если карта неактивна, то вызываем первую, если активна, то вторую
  var mouseUp = function () {
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
  window.utils.pinMain.addEventListener('mouseup', mouseUp);
  window.utils.pinMain.addEventListener('mousedown', dragAndDrop);
  window.utils.formAd.addEventListener('submit', window.form.sendData);
  window.utils.formFilters.addEventListener('change', window.filters.filterComplete);

  window.map = {
    makeMapInactive: makeMapInactive
  };
})();
