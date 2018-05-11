'use strict';

window.pictures = (function () {
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
            var pictures = window.utils.formAd.querySelectorAll('.ad-form__photo');
            if (pictures.length > 0) {
              pictures[0].style.display = 'none';
            }
          }

        });
        reader.readAsDataURL(file);
      }
    });
  };

  var dragDropPictures = function (dropZone) {
    var draggedElem;
    function insertAfter(element, referenceNode) {
      referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
    }
    dropZone.addEventListener('dragstart', function (e) {
      draggedElem = e.target;
    });

    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    dropZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
    });

    dropZone.addEventListener('drop', function (e) {
      // когда одна фотография идёт перед другой или если последний элемент
      if (e.target === draggedElem.nextElementSibling || e.target === dropZone.lastChild) {
        if (e.target.classList.contains('ad-form__photo')) {
          insertAfter(draggedElem, e.target);
        }
      } else {
        if (e.target.classList.contains('ad-form__photo')) {
          draggedElem.parentNode.insertBefore(draggedElem, e.target);
        }
      }
    });
  };

  var picturesChooser = window.utils.formAd.querySelector('input[name = images]');
  var picturesPreview = window.utils.formAd.querySelector('.ad-form__photo');
  var avatarChooser = window.utils.formAd.querySelector('input[name = avatar]');
  var avatarPreview = window.utils.formAd.querySelector('.ad-form-header__preview img');
  var photoDropZone = window.utils.formAd.querySelector('.ad-form__photo-container');
  loadPicture(avatarChooser, avatarPreview);
  loadPicture(picturesChooser, picturesPreview);
  dragDropPictures(photoDropZone);

})();
