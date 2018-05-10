'use strict';

(function () {
  var loadPicture = function (fileChooser, preview) {
    fileChooser.addEventListener('change', function () {
      var file = fileChooser.files[0];
      var fileName = file.name.toLowerCase();

      var matches = window.utils.FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          if (preview.parentNode.classList.contains('ad-form-header__preview')) {
            preview.src = reader.result;
          } else {
            var image = preview.cloneNode(true);
            image.style.display = 'block';
            preview.parentNode.appendChild(image);
            image.style.backgroundImage = 'url(' + reader.result + ')';
            image.style.backgroundSize = 'cover';
            // скрыть серый квадрат
            var pictures = document.querySelectorAll('.ad-form__photo');
            if (pictures.length > 0) {
              pictures[0].style.display = 'none';
            }
          }

        });
        reader.readAsDataURL(file);
      }
    });
  };

  var drugDropPictures = function (dropZone) {
    var druggedElem;
    function insertAfter(element, referenceNode) {
      referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
    }
    dropZone.addEventListener('dragstart', function (e) {
      druggedElem = e.target;
    });

    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    dropZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
    });

    dropZone.addEventListener('drop', function (e) {
      // когда одна фотография идёт перед другой или если последний элемент
      if (e.target === druggedElem.nextElementSibling || e.target === dropZone.lastChild) {
        if (e.target.classList.contains('ad-form__photo')) {
          insertAfter(druggedElem, e.target);
        }
      } else {
        if (e.target.classList.contains('ad-form__photo')) {
          druggedElem.parentNode.insertBefore(druggedElem, e.target);
        }
      }
    });
  };

  var picturesChooser = document.querySelector('input[name = images]');
  var picturesPreview = document.querySelector('.ad-form__photo');
  var avatarChooser = document.querySelector('input[name = avatar]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoDropZone = document.querySelector('.ad-form__photo-container');
  loadPicture(avatarChooser, avatarPreview);
  loadPicture(picturesChooser, picturesPreview);
  drugDropPictures(photoDropZone);

})();
