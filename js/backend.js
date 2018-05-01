'use strict';

window.backend = (function () {

  return {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      var url = 'https://js.dump.academy/keksobooking/data';
      // не надо парсить ответ
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
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

      xhr.timeout = 10000; // 10s

      xhr.open('GET', url);
      // отправить запрос
      xhr.send();
    },

    send: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      var url = 'https://js.dump.academy/keksobooking';

      // есть два типа ошибок: одни связаны с сервером, другие происходят в момент загрузки,
      // поэтому два раза вызываем onError

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(xhr.status);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Передача не успела выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', url);
      // отправить данные
      xhr.send(data);
    }
  };
})();
