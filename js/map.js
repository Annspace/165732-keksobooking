'use strict';

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
var ads = [];

var map = document.querySelector('.map');
// map.classList.remove('map--faded');

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

// для features отрезаем кусок массива случайным образом
// var cutArrayRandom = function (array) {
//  array.length = random(array);
//  return array;
// };


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

for (var i = 0; i < 8; i++) {
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

var MapPinTemplate = document.querySelector('template').content;
MapPinTemplate = MapPinTemplate.querySelectorAll('button')[1];
var MapAdTemplate = document.querySelector('template').content;
MapAdTemplate = MapAdTemplate.querySelector('article');
var fragment = document.createDocumentFragment();

var renderPin = function (ad) {
  var MapPinElement = MapPinTemplate.cloneNode(true);
  MapPinElement.style = 'left:' + ad['location']['x'] + 'px; top:'
    + ads[i]['location']['y'] + 'px;';
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
  for (i = 1; i < ad['offer']['photos'].length; i++) {
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
  for (i = 0; i < 8; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};


// fillPins();
// parent.insertBefore(renderAd(ads[0]), mapFilters);

var fields = document.querySelectorAll('fieldset');

for (i = 0; i < fields.length; i++) {
  fields[i].disabled = true;
}

var mapPinMain = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var addressField = document.getElementById('address');


var makeMapActive = function () {
  fillPins();
  for (i = 0; i < fields.length; i++) {
    fields[i].disabled = false;
  }
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
};


mapPinMain.addEventListener('mouseup', function (e) {
  makeMapActive();
  addressField.setAttribute('value', e.clientX + ',' + e.clientY);
});

// Метки и картинки связаны через src картинок
// Обрезаем src картинки до img/avatars/user*.png , ищем такой же src у картинок
// из набора ads, если нашли картинки с одинаковыми src, то добавляем соответствующий ad в DOM
// в первый раз просто добавляем ad, последующие разы заменяем уже добавленный (flag для этого)

var flag = 0;

var showCurrentAd = function (currentPin, adsArray) {
  var slicedCurrentPin = currentPin.src.substring(43, currentPin.src.length);
  for (i = 0; i < adsArray.length; i++) {
    if (adsArray[i]['author']['avatar'] === slicedCurrentPin) {
      if (flag === 0) {
        var mapFilters = document.querySelector('.map__filters-container');
        mapFilters.parentNode.appendChild(renderAd(ads[i]));
        flag = 1;
        break;
      } else {
        var mapCardPopup = document.querySelector('.map__card');
        mapCardPopup.parentNode.replaceChild(renderAd(ads[i]), mapCardPopup);
        break;
      }
    }
  }
};

var closeAd = function () {
  var mapCardPopup = document.querySelector('.map__card');
  mapCardPopup.classList.add('hidden');
};

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('pin')) {
    showCurrentAd(e.target, ads);
  }
  if (e.target.classList.contains('popup__close')) {
    closeAd();
  }
});

var makeMapInactive = function () {
  for (i = 0; i < fields.length; i++) {
    fields[i].disabled = true;
  }
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  adForm.reset();
  addressField.setAttribute('value', 601 + ',' + 401);
  var mapPins = document.querySelectorAll('.map__pin');
  for (i = 0; i < mapPins.length; i++) {
    mapPins[i].style.display = 'none';
    if (mapPins[i].classList.contains('map__pin--main')) {
      mapPins[i].style.display = 'block';
    }
  }
};

var resetButton = document.querySelector('.ad-form__reset');
resetButton.addEventListener('click', makeMapInactive);

// синхронизация приезда/отъезда
var timeElem = document.querySelector('.ad-form__element--time');
var timein = document.getElementById('timein');
var timeout = document.getElementById('timeout');

timeElem.onchange = function (e) {
  var target = e.target;
  timein.value = target.value;
  timeout.value = target.value;
};

// синхронизация типа жилья и цены за ночь
var typeElem = document.getElementById('type');
var priceElem = document.getElementById('price');

var compareTypePrice = function (t) {
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

typeElem.addEventListener('change', function (e) {
  var target = e.target;
  compareTypePrice(target.value);
});

// синхронизация числа гостей и комнат
var room = document.getElementById('room_number');
var capacity = document.getElementById('capacity');

var compareRoomsGuests = function (roomVal, capacityVal) {
  if (capacityVal !== '1' && roomVal === '1') {
    capacity.setCustomValidity('Для 1 гостя');
  } else {
    capacity.setCustomValidity('');
  }
  if (capacityVal !== ('2' || '1') && roomVal === '2') {
    capacity.setCustomValidity('Для 2 гостей или для 1 гостя');
  } else {
    capacity.setCustomValidity('');
  }

  if (capacityVal === '0' && roomVal === '3') {
    capacity.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя;');
  } else {
    capacity.setCustomValidity('');
  }

  if (capacityVal !== '0' && roomVal === '100') {
    capacity.setCustomValidity('не для гостей');
  } else {
    capacity.setCustomValidity('');
  }
};


room.addEventListener('change', function (e) {
  compareRoomsGuests(e.target.value, capacity.value);
});

capacity.addEventListener('change', function (e) {
  compareRoomsGuests(room.value, e.target.value);
});


