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
map.classList.remove('map--faded');

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
var fragment = document.createDocumentFragment();


var renderPin = function (ad) {
  var MapPinElement = MapPinTemplate.cloneNode(true);
  MapPinElement.querySelector('.map__pin').style = 'left:' + ad['location']['x'] + 'px; top:'
    + ads[i]['location']['y'] + 'px;';
  MapPinElement.querySelector('.map__pin img').src = ad['author']['avatar'];
  MapPinElement.querySelector('.map__pin img').alt = ad['offer']['title'];

  return MapPinElement;
};

var renderAd = function (ad) {
  var MapAdElement = MapPinTemplate.cloneNode(true);
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


fillPins();

var mapFilters = document.querySelector('.map__filters-container');
var parent = mapFilters.parentNode;

parent.insertBefore(renderAd(ads[0]), mapFilters);


