'use strict';

window.globals = (function () {
  return {
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
      'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    TYPES: ['flat', 'palace', 'house', 'bungalo'],
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    CHECKINS: ['12:00', '13:00', '14:00'],
    CHECKOUTS: ['12:00', '13:00', '14:00'],
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
    PIN_MAIN_HEIGHT: 80, // поправка на острый конец
    PIN_MAIN_WIDTH: 62, // поправка на острый конец
    PX: 2,
    ads: [],
    avatars: [],
    template: document.querySelector('template').content,
    addressField: document.getElementById('address'),
    map: document.querySelector('.map'),
    pinMain: document.querySelector('.map__pin--main')
  };
})();
