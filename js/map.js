'use strict';

var USER_NUMBERS = [];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var LOCATIONS_X = [];
var LOCATIONS_Y = [];
var PRICES = [];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var ROOMS = [];
var GUESTS = [];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
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

//  вызываем в цикле (каждый раз формируется случайное число)
var random = function (array) {
  var randElement = Math.floor(Math.random() * array.length);
  return randElement;
};

for (var i = 1; i < 9; i++) {
  USER_NUMBERS.push('0' + i);
}

var generateArray = function (k, l, array) {
  for (i = k; i <= l; i++) {
    array.push(i);
  }
  return array;
};

// для features отрезаем кусок массива случайным образом
var cutArrayRandom = function (features) {
  features.length = random(features);
  return features;
};


generateArray(300, 901, LOCATIONS_X);
generateArray(150, 500, LOCATIONS_Y);
generateArray(1000, 1000000, PRICES);
generateArray(1, 5, ROOMS);
generateArray(1, 5, GUESTS);
cutArrayRandom(FEATURES);

// перемешиваем массивы перед циклом (только те которые не фиксированные)
var shuffleUsersNumbs = shuffle(USER_NUMBERS);
var shuffleLocationsX = shuffle(LOCATIONS_X);
var shuffleLocationsY = shuffle(LOCATIONS_Y);
var shufflePrices = shuffle(PRICES);
var shufflePhotos = shuffle(PHOTOS);

// обрезаем перемешанные массивы до числа объектов
// user numbers не надо (и так 8шт)


for (i = 0; i < 8; i++) {
  ads[i] = {
    'author': {
      'avatar': 'img/avatars/user' + shuffleUsersNumbs[i]
    },

    'location': {
      'x': shuffleLocationsX[i],
      'y': shuffleLocationsY[i]
    },

    'offer': {
      'title': TITLES[i],
      'address': this.author

    }

  };
}

/*  "price":
    "type":
    "rooms":
    "guests":
    "checkin":
    "checkout":
    "features":
    "description":
    "photos":
    */


