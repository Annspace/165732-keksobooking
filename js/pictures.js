'use strict';

(function () {
  var fileChooser = document.querySelector('input[name = images]');
  var preview = document.querySelector('.ad-form__photo');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = window.utils.FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        if (preview.style.backgroundImage) {
          var image = preview.cloneNode(true);
          preview.parentNode.appendChild(image);
          image.style.backgroundImage = 'url(' + reader.result + ')';
          image.style.backgroundSize = 'cover';
        } else {
          preview.style.backgroundImage = 'url(' + reader.result + ')';
          preview.style.backgroundSize = 'cover';
        }
      });
      reader.readAsDataURL(file);
    }
  });

  var druggedElem;
  var photoDropZone = document.querySelector('.ad-form__photo-container');
  photoDropZone.addEventListener('dragstart', function (e) {
    druggedElem = e.target;
  });

  photoDropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  photoDropZone.addEventListener('dragleave', function (e) {
    e.preventDefault();
  });

  photoDropZone.addEventListener('drop', function (e) {
    if (e.target.classList.contains('ad-form__photo')) {
      druggedElem.parentNode.insertBefore(druggedElem, e.target);
    }
  });
})();
