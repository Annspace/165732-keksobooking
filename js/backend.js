'use strict';

window.backend = (function () {

  // если параметра data нет, то происходит загрузка, если есть, то отправка
  var sendLoadData = function (onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    var url;
    if (typeof data === 'undefined') {
      url = window.utils.URL_LOAD;
      // не надо парсить ответ
      xhr.responseType = 'json';
    } else {
      url = window.utils.URL_SEND;
    }
    xhr.addEventListener('load', function () {
      if (xhr.status === window.utils.SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    // не связанные с сервером
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = window.utils.TIMEOUT;
    if (typeof data === 'undefined') {
      xhr.open('GET', url);
      // отправить запрос
      xhr.send();
    } else {
      xhr.open('POST', url);
      // отправить данные
      xhr.send(data);
    }

  };

  return {
    sendLoadData: sendLoadData
  };

})();
