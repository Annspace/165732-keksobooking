'use strict';

window.debounce = (function () {
  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, window.utils.DEBOUNCE_INTERVAL);
  };
  return debounce;
})();
