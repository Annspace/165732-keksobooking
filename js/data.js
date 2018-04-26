'use strict';

window.data = (function () {
// Перемешивание
  var shuffle = function (array) {
    var tempArray = array.slice(0); // передача массива происходит по ссылке, а не по значению, поэтому создаём копию
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
    var newArray = array.slice(randomInteger(0, array.length)); // передача массива происходит по ссылке, а не по значению, поэтому создаём копию
    return newArray;
  };


  var createObjects = function (i) {
    var temp = [];
    temp[i] = {
      'author': {
        'avatar': 'img/avatars/user' + '0' + (i + 1) + '.png'
      },

      'location': {
        'x': randomInteger(300, 901),
        'y': randomInteger(150, 500)
      },

      'offer': {
        'title': window.globals.TITLES[i],
        'address': '',
        'price': randomInteger(1000, 1000000),
        'type': window.globals.TYPES[randomInteger(0, 3)],
        'rooms': randomInteger(1, 5),
        'guests': randomInteger(1, 5),
        'checkin': window.globals.CHECKINS[randomInteger(0, 2)],
        'checkout': window.globals.CHECKOUTS[randomInteger(0, 2)],
        'features': cutArrayRandom(window.globals.FEATURES),
        'description': '',
        'photos': shuffle(window.globals.PHOTOS)
      }

    };
    return temp[i];
  };
  return {
    // добавляем объекты в массив ads
    generateAds: function () {
      for (var i = 0; i < window.globals.NUMBER_ADS; i++) {
        window.globals.ads.push(createObjects(i));
      }
    }
  };

})();
