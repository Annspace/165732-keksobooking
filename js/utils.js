'use strict';

(function () {
  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, window.utils.DEBOUNCE_INTERVAL);
  };
  var template = document.querySelector('template').content;

  // селекторы по форме
  var formAd = document.querySelector('.ad-form');
  var fields = formAd.querySelectorAll('fieldset');
  var addressField = formAd.querySelector('#address');
  var price = formAd.querySelector('#price');
  var capacity = formAd.querySelector('#capacity');
  var room = formAd.querySelector('#room_number');
  var type = formAd.querySelector('#type');
  var timeIn = formAd.querySelector('#timein');
  var timeOut = formAd.querySelector('#timeout');

  // селекторы по карте и фильтрам
  var map = document.querySelector('.map');
  var pinMain = map.querySelector('.map__pin--main');
  var formFilters = map.querySelector('.map__filters');
  var params = formFilters.querySelectorAll('.map__filter');
  var features = map.querySelectorAll('input[name = "features"]');

  window.utils = {
    START_X: 601,
    START_Y: 401,
    NUMBER_PINS: 8,
    NUMBER_ADS: 8,
    LENGTH_OF_NAME: 10,
    PIN_EDGE_TOP: 70,
    PIN_EDGE_LEFT: 25,
    TYPES_INFO: {flat: {price: 1000, translation: 'Квартира'},
      house: {price: 5000, translation: 'Дом'},
      bungalo: {price: 0, translation: 'Бунгало'},
      palace: {price: 10000, translation: 'Бунгало'}
    },
    ERROR_TYPES: {400: 'Вводишь неверный запрос', 401: 'Пользователь-то не авторизован',
      404: 'Сорри, ничего не найдено', 500: 'На сервере какая-то ошибочка'},
    PIN_MAIN_HEIGHT: 80, // поправка на острый конец
    PIN_MAIN_WIDTH: 62, // поправка на острый конец
    PIN_MAIN_START_LEFT: 570,
    PIN_MAIN_START_TOP: 375,
    MIN_PRICE: 10000,
    MAX_PRICE: 50000,
    ONE_ROOM: 1,
    TWO_ROOMS: 2,
    THREE_ROOMS: 3,
    HUNDRED_ROOMS: 100,
    NO_GUESTS: 0,
    THREE_GUESTS: 3,
    ONE_GUEST: 1,
    SUCCESS_STATUS: 200,
    TIMEOUT: 1000,
    TIMEOUT_ERROR: 4000,
    ESC_BUTTON: 27,
    PX: 2,
    URL_SEND: 'https://js.dump.academy/keksobooking',
    URL_LOAD: 'https://js.dump.academy/keksobooking/data',
    DEFAULT_AVATAR: 'img/muffin-grey.svg',
    NUMBER_OF_PINS: 5,
    DEBOUNCE_INTERVAL: 500,
    FILE_TYPES: ['gif', 'jpg', 'jpeg', 'png'],
    ads: [],
    template: template,
    formAd: formAd,
    fields: fields,
    addressField: addressField,
    map: map,
    pinMain: pinMain,
    formFilters: formFilters,
    params: params,
    debounce: debounce,
    features: features,
    price: price,
    capacity: capacity,
    room: room,
    type: type,
    timeIn: timeIn,
    timeOut: timeOut
  };
})();
