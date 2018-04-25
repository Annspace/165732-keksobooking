'use strict';

(function () {
  var renderPhotos = function (MapAdElement, ad) {
    MapAdElement.querySelector('.popup__photo').src = ad.offer.photos[0];
    var image = MapAdElement.querySelector('.popup__photo');
    for (var i = 1; i < ad.offer.photos.length; i++) {
      var PhotoElement = image.cloneNode(true);
      MapAdElement.querySelector('.popup__photos').appendChild(PhotoElement);
      image.src = ad.offer.photos[i];
    }
  };

  var renderFeatures = function (MapAdElement, ad) {
    var featuresElements = MapAdElement.querySelectorAll('.popup__feature');
    var featuresUl = MapAdElement.querySelector('.popup__features');
    for (var i = 0; i < featuresElements.length; i++) {
      featuresElements[i].remove();
    }
    var featuresLi = [];
    for (i = 0; i < ad.offer.features.length; i++) {
      featuresLi[i] = document.createElement('li');
      featuresLi[i].classList.add('popup__feature');
      featuresLi[i].classList.add('popup__feature--' + ad.offer.features[i]);
      featuresUl.appendChild(featuresLi[i]);
    }
  };

  window.renderAd = function (ad) {
    var MapAdTemplate = window.globals.template.querySelector('article');
    var MapAdElement = MapAdTemplate.cloneNode(true);
    MapAdElement.querySelector('.popup__avatar').alt = ad.author.avatar;
    MapAdElement.querySelector('.popup__title').textContent = ad.offer.title;
    MapAdElement.querySelector('.popup__text--address').textContent = ad.offer.address;
    MapAdElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ' + 'P/ночь';
    MapAdElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' '
      + 'комнаты для' + ' ' + ad['offer']['guests'] + ' ' + 'гостей';
    MapAdElement.querySelector('.popup__text--time').textContent = 'Заезд после' + ' '
      + ad.offer.checkin + ' ' + 'Выезд до' + ' ' + ad.offer.checkout;
    MapAdElement.querySelector('.popup__avatar').alt = ad.author.avatar;
    MapAdElement.querySelector('.popup__avatar').src = ad.author.avatar;

    var typeElement = MapAdElement.querySelector('.popup__type');
    typeElement.textContent = window.globals.TYPES_INFO[ad.offer.type].translation;

    renderPhotos(MapAdElement, ad);
    renderFeatures(MapAdElement, ad);

    return MapAdElement;
  };
})();
