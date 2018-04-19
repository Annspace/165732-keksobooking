'use strict';

// Константы
var USER_NUMBERS = [];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var LOCATIONS_X = [];
var LOCATIONS_Y = [];
var PRICES = [];
var TYPES = ['flat', 'palace', 'house', 'bungalo', 'palace', 'flat', 'house', 'bungalo'];
var ROOMS = [];
var GUESTS = [];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHECKINS = ['12:00', '13:00', '14:00', '12:00', '13:00', '14:00', '12:00', '13:00'];
var CHECKOUTS = ['13:00', '12:00', '14:00', '13:00', '12:00', '14:00', '13:00', '13:00'];
var START_X = 601;
var START_Y = 401;
var NUMBER_PINS = 8;
var NUMBER_ADS = 8;
var ads = [];
var avatars = [];

// Селекторы
var map = document.querySelector('.map');
var MapTemplate = document.querySelector('template').content;
var MapButtonTemplate = MapTemplate.querySelectorAll('button')[1];
var MapAdTemplate = MapTemplate.querySelector('article');
var fragment = document.createDocumentFragment();
var fields = document.querySelectorAll('fieldset');
var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var addressField = document.getElementById('address');
var resetButton = document.querySelector('.ad-form__reset');


// Функции
var shuffle = function (array) {
  var counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    var index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

//   случайное число
var random = function (array) {
  var randElement = Math.floor(Math.random() * (array.length + 1));
  return randElement;
};

// случайная обрезка
var generateFeatures = function (array) {
  var newArray = [];
  for (var i = 0; i <= random(array); i++) {
    newArray.push(FEATURES[i]);
  }
  return newArray;
};


var generateArray = function (k, l, array) {
  for (var i = k; i <= l; i++) {
    array.push(i);
  }
  return array;
};


generateArray(300, 901, LOCATIONS_X);
generateArray(150, 500, LOCATIONS_Y);
generateArray(1000, 1000000, PRICES);
generateArray(1, 5, ROOMS);
generateArray(1, 5, GUESTS);
generateArray(1, 8, USER_NUMBERS);

// перемешиваем массивы перед циклом (только те которые нефиксированные)
var shuffleUsersNumbs = shuffle(USER_NUMBERS);
var shuffleLocationsX = shuffle(LOCATIONS_X);
var shuffleLocationsY = shuffle(LOCATIONS_Y);
var shufflePrices = shuffle(PRICES);
var shuffleRooms = shuffle(ROOMS);
var shuffleGuests = shuffle(GUESTS);


var generateAds = function () {
  for (var i = 0; i < NUMBER_ADS; i++) {
    ads[i] = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + shuffleUsersNumbs[i] + '.png'
      },

      'location': {
        'x': shuffleLocationsX[i],
        'y': shuffleLocationsY[i]
      },

      'offer': {
        'title': TITLES[i],
        'address': String(shuffleLocationsX[i]) + ',' + String(shuffleLocationsY[i]),
        'price': shufflePrices[i],
        'type': TYPES[i],
        'rooms': shuffleRooms[i],
        'guests': shuffleGuests[i],
        'checkin': CHECKINS[i],
        'checkout': CHECKOUTS[i],
        'features': generateFeatures(FEATURES),
        'description': '',
        'photos': shuffle(PHOTOS)
      }

    };
  }
};

var renderPin = function (ad) {
  var MapPinElement = MapButtonTemplate.cloneNode(true);
  MapPinElement.style = 'left:' + ad['location']['x'] + 'px; top:'
    + ad['location']['y'] + 'px;';
  MapPinElement.querySelector('img').src = ad['author']['avatar'];
  MapPinElement.querySelector('img').alt = ad['offer']['title'];

  return MapPinElement;
};

var renderAd = function (ad) {
  var MapAdElement = MapAdTemplate.cloneNode(true);
  MapAdElement.querySelector('.popup__avatar').alt = ad['author']['avatar'];
  MapAdElement.querySelector('.popup__title').textContent = ad['offer']['title'];
  MapAdElement.querySelector('.popup__text--address').textContent = ad['offer']['address'];
  MapAdElement.querySelector('.popup__text--price').textContent = ad['offer']['price'] + ' ' + 'P/ночь';
  MapAdElement.querySelector('.popup__text--capacity').textContent = ad['offer']['rooms'] + ' ' + 'комнаты для' + ' ' + ad['offer']['guests'] + ' ' + 'гостей';
  MapAdElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ' ' + ad['offer']['checkin'] + ' ' + 'Выезд до' + ' ' + ad['offer']['checkout'];
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
  for (i = 0; i < featuresElements.length; i++) {
    featuresElements[i].textContent = ad['offer']['features'][i];
  }

  return MapAdElement;
};


var fillPins = function () {
  for (var i = 0; i < NUMBER_PINS; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};


var makeMapActive = function () {
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
  var slicedCurrentPin = currentPin.src.substring(currentPin.src.length - 10, currentPin.src.length);
  for (var i = 0; i < adsArray.length; i++) {
    avatars[i] = adsArray[i]['author']['avatar'];
    var slicedAdAvatar = avatars[i].substring(avatars[i].length - 10, avatars[i].length);
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

var makeMapInactive = function () {
  for (var i = 0; i < fields.length; i++) {
    fields[i].disabled = true;
  }
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
};

// функции для обработчиков
var adShowHide = function (clikedElem) {
  if (clikedElem.target.classList.contains('pin')) {
    showCurrentAd(clikedElem.target, ads);
  }
  if (clikedElem.target.classList.contains('popup__close')) {
    closeAd();
  }
  addressField.setAttribute('value', clikedElem.clientX + ',' + clikedElem.clientY);
};

// Неактивность в момент открытия
makeMapInactive();

// Обработчики событий
document.addEventListener('click', adShowHide);
mapPinMain.addEventListener('mouseup', makeMapActive);
resetButton.addEventListener('click', makeMapInactive);
