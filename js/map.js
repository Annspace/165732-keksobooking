'use strict';

// Константы
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'palace', 'house', 'bungalo', 'palace', 'flat', 'house', 'bungalo'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHECKINS = ['12:00', '13:00', '14:00', '12:00', '13:00', '14:00', '12:00', '13:00'];
var CHECKOUTS = ['13:00', '12:00', '14:00', '13:00', '12:00', '14:00', '13:00', '13:00'];
var START_X = 601;
var START_Y = 401;
var NUMBER_PINS = 8;
var NUMBER_ADS = 8;
var LENGTH_OF_NAME = 10;
var ads = [];
var avatars = [];


// Функции

// Перемешивание
var shuffle = function (array) {
  var tempArray = array.slice(0);
  var counter = tempArray.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    var index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    var temp = tempArray[counter];
    tempArray[counter] = tempArray[index];
    tempArray[index] = temp;
  }

  return tempArray;
};

//   случайное число
var randomInteger = function (min, max) {
  min = min || 1;
  max = max || 1000000;
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

// случайная обрезка
var cutArrayRandom = function (array) {
  var newArray = array.slice(randomInteger(0, array.length));
  return newArray;
};

// возвращает сгенерированный массив из восьми объектов
var createObjects = function () {
  var temp = [];
  for (var i = 0; i < NUMBER_ADS; i++) {
    temp[i] = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + (i + 1) + '.png'
      },

      'location': {
        'x': randomInteger(300, 901),
        'y': randomInteger(150, 500)
      },

      'offer': {
        'title': TITLES[i],
        'address': '',
        'price': randomInteger(1000, 1000000),
        'type': TYPES[i],
        'rooms': randomInteger(1, 5),
        'guests': randomInteger(1, 5),
        'checkin': CHECKINS[i],
        'checkout': CHECKOUTS[i],
        'features': cutArrayRandom(FEATURES),
        'description': '',
        'photos': shuffle(PHOTOS)
      }

    };
  }
  return temp;
};

// добавляем объекты в массив ads
var generateAds = function () {
  for (var i = 0; i < NUMBER_ADS; i++) {
    ads.push(createObjects()[i]);
  }
};

var renderPin = function (ad) {
  var MapTemplate = document.querySelector('template').content;
  var MapButtonTemplate = MapTemplate.querySelectorAll('button')[1];
  var MapPinElement = MapButtonTemplate.cloneNode(true);
  MapPinElement.style = 'left:' + ad['location']['x'] + 'px; top:'
    + ad['location']['y'] + 'px;';
  MapPinElement.querySelector('img').src = ad['author']['avatar'];
  MapPinElement.querySelector('img').alt = ad['offer']['title'];

  return MapPinElement;
};

var renderAd = function (ad) {
  var MapTemplate = document.querySelector('template').content;
  var MapAdTemplate = MapTemplate.querySelector('article');
  var MapAdElement = MapAdTemplate.cloneNode(true);
  MapAdElement.querySelector('.popup__avatar').alt = ad['author']['avatar'];
  MapAdElement.querySelector('.popup__title').textContent = ad['offer']['title'];
  MapAdElement.querySelector('.popup__text--address').textContent = ad['offer']['address'];
  MapAdElement.querySelector('.popup__text--price').textContent = ad['offer']['price'] + ' ' + 'P/ночь';
  MapAdElement.querySelector('.popup__text--capacity').textContent = ad['offer']['rooms'] + ' '
    + 'комнаты для' + ' ' + ad['offer']['guests'] + ' ' + 'гостей';
  MapAdElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ' '
    + ad['offer']['checkin'] + ' ' + 'Выезд до' + ' ' + ad['offer']['checkout'];
  MapAdElement.querySelector('.popup__avatar').alt = ad['author']['avatar'];
  MapAdElement.querySelector('.popup__avatar').src = ad['author']['avatar'];
  MapAdElement.querySelector('.popup__photo').src = ad['offer']['photos'][0];

  var typeElement = MapAdElement.querySelector('.popup__type');

  switch (ad['offer']['type']) {
    case 'flat':
      typeElement.textContent = 'Квартира';
      break;
    case 'bungalo':
      typeElement.textContent = 'Бунгало';
      break;
    case 'house':
      typeElement.textContent = 'Дом';
      break;
  }

  var image = MapAdElement.querySelector('.popup__photo');
  for (var i = 1; i < ad['offer']['photos'].length; i++) {
    var PhotoElement = image.cloneNode(true);
    MapAdElement.querySelector('.popup__photos').appendChild(PhotoElement);
    image.src = ad['offer']['photos'][i];
  }
  var featuresElements = MapAdElement.querySelectorAll('.popup__feature');

  for (i = 0; i < ad['offer']['features'].length; i++) {
    featuresElements[i].style.display = 'inline-block';
  }

  return MapAdElement;
};


var fillPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < NUMBER_PINS; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};


var makeMapActive = function (e) {
  var map = document.querySelector('.map');
  var fields = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  generateAds();
  fillPins();
  for (var i = 0; i < fields.length; i++) {
    fields[i].disabled = false;
  }
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
};


// Метки и картинки связаны через src картинок
// Обрезаем src картинки до img/avatars/user*.png , ищем такой же src у картинок
// из набора ads, если нашли картинки с одинаковыми src, то добавляем соответствующий ad в DOM
// в первый раз просто добавляем ad, последующие разы заменяем уже добавленный
// отрезаем с конца (последние 10 символов)

var showCurrentAd = function (currentPin, adsArray) {
  var slicedCurrentPin = currentPin.src.substring(currentPin.src.length - LENGTH_OF_NAME, currentPin.src.length);
  for (var i = 0; i < adsArray.length; i++) {
    avatars[i] = adsArray[i]['author']['avatar'];
    var slicedAdAvatar = avatars[i].substring(avatars[i].length - LENGTH_OF_NAME, avatars[i].length);
    if (slicedAdAvatar === slicedCurrentPin) {
      if (document.querySelector('.map__card')) {
        var mapCardPopup = document.querySelector('.map__card');
        mapCardPopup.parentNode.replaceChild(renderAd(ads[i]), mapCardPopup);
        break;
      } else {
        var mapFilters = document.querySelector('.map__filters-container');
        mapFilters.parentNode.appendChild(renderAd(ads[i]));
        break;
      }
    }
  }
};

var closeAd = function () {
  var mapCardPopup = document.querySelector('.map__card');
  mapCardPopup.classList.add('hidden');
};

var makeMapInactive = function (e) {
  e = e || 1; // возможность вызова без параметров
  var fields = document.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var addressField = document.getElementById('address');
  if (e === 1 || e.target.classList.contains('ad-form__reset')) {
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = true;
    }
    var map = document.querySelector('.map');
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adForm.reset();
    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').style.display = 'none';
    }
    addressField.setAttribute('value', START_X + ',' + START_Y);
    var mapPins = document.querySelectorAll('.map__pin');
    for (i = 0; i < mapPins.length; i++) {
      mapPins[i].style.display = 'none';
      if (mapPins[i].classList.contains('map__pin--main')) {
        mapPins[i].style.display = 'block';
      }
    }
  }
};

// функции для обработчиков
var adShowHide = function (clikedElem) {
  var addressField = document.getElementById('address');
  if (clikedElem.target.classList.contains('pin')) {
    showCurrentAd(clikedElem.target, ads);
    var leftCoords = clikedElem.target.parentNode.style.left;
    var topCoords = clikedElem.target.parentNode.style.top;
    var slicedLeft = leftCoords.substring(0, leftCoords.length - 2);
    var slicedTop = topCoords.substring(0, topCoords.length - 2);
    addressField.setAttribute('value', slicedLeft + ',' + slicedTop);
  }
  if (clikedElem.target.classList.contains('popup__close')) {
    closeAd();
  }
};

// синхронизация типа жилья и цены за ночь
var compareTypePrice = function (t) {
  var priceElem = document.getElementById('price');
  switch (t) {
    case 'bungalo':
      priceElem.placeholder = 0;
      priceElem.min = 0;
      break;
    case 'flat':
      priceElem.placeholder = 1000;
      priceElem.min = 1000;
      break;
    case 'house':
      priceElem.placeholder = 5000;
      priceElem.min = 5000;
      break;
    case 'palace':
      priceElem.placeholder = 10000;
      priceElem.min = 10000;
      break;
  }
};

// синхронизация числа гостей и комнат
var compareRoomsGuests = function (capVal, roomVal) {
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

var timeInOut = function (e) {
  var timein = document.getElementById('timein');
  var timeout = document.getElementById('timeout');
  if (e.target === timein || timeout) {
    var target = e.target;
    timein.value = target.value;
    timeout.value = target.value;
  }
};

var synchronizeFields = function () {
  var capacity = document.getElementById('capacity');
  var room = document.getElementById('room_number');
  var typeElem = document.getElementById('type');
  compareTypePrice(typeElem.value);
  compareRoomsGuests(Number(capacity.value), Number(room.value));
};

// Неактивность в момент открытия
makeMapInactive();

// Обработчики событий
document.addEventListener('click', adShowHide);
document.querySelector('.map__pin--main').addEventListener('mouseup', makeMapActive);
document.addEventListener('click', makeMapInactive);
document.addEventListener('change', timeInOut);
document.addEventListener('change', synchronizeFields);
