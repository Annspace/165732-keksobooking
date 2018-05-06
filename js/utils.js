'use strict';

window.utils = (function () {
  return {
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
    SUCCESS_STATUS: 200,
    TIMEOUT: 1000,
    PX: 2,
    URL_SEND: 'https://js.dump.academy/keksobooking',
    URL_LOAD: 'https://js.dump.academy/keksobooking/data',
    NUMBER_OF_PINS: 5,
    DEBOUNCE_INTERVAL: 500,
    ads: [],
    template: document.querySelector('template').content,
    addressField: document.getElementById('address'),
    map: document.querySelector('.map'),
    pinMain: document.querySelector('.map__pin--main'),
    form: document.querySelector('.ad-form'),
    fields: document.querySelectorAll('fieldset'),
    filtersElements: document.querySelectorAll('.map__filter'),
    mapFilters: document.querySelector('.map__filters'),
    params: document.querySelectorAll('.map__filter'),
    lastTimeout: '',
    debounce: function (fun) {
      if (window.utils.lastTimeout) {
        window.clearTimeout(window.utils.lastTimeout);
      }
      window.utils.lastTimeout = window.setTimeout(fun, window.utils.DEBOUNCE_INTERVAL);
    },
    featuresElements: document.querySelectorAll('input[name = "features"]')
  };
})();
