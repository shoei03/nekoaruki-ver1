document.addEventListener('DOMContentLoaded', function() {
  var catImage = document.getElementById('movableCat');
  var isDragging = false;
  var startX, startY, initialX, initialY;

  var touchStartHandler = function(e) {
    if (e.touches.length === 1) { // シングルタッチのみを処理お
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialX = catImage.offsetLeft;
      initialY = catImage.offsetTop;
      catImage.style.cursor = 'grabbing';
    }
  };

  var touchMoveHandler = function(e) {
    if (isDragging) {
      var currentX = e.touches[0].clientX;
      var currentY = e.touches[0].clientY;
      var deltaX = currentX - startX;
      var deltaY = currentY - startY;
      catImage.style.left = initialX + deltaX + 'px';
      catImage.style.top = initialY + deltaY + 'px';
    }
  };

  var touchEndHandler = function() {
    isDragging = false;
    catImage.style.cursor = 'grab';
  };

  catImage.addEventListener('touchstart', touchStartHandler);
  document.addEventListener('touchmove', touchMoveHandler);
  document.addEventListener('touchend', touchEndHandler);
});