document.addEventListener('DOMContentLoaded', function() {
  var catImage = document.getElementById('movableCat');
  var isDragging = false;
  var startX, startY, initialX, initialY;

  var touchStartHandler = function(e) {
    if (e.touches.length === 1) { // シングルタッチのみを処理
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

  // 画像を左端から動かす
  catImage.animate(
    // 途中の状態を表す配列
    [
      { transform: 'translateX(0)', offset: 0}, // 開始時の状態
      { transform: 'translateX(200px)', offset: 0.1},
      { transform: 'translateX(200px)', offset: 0.2},
      { transform: 'translateY(-200px)', offset: 0.3},
      { transform: 'translateY(-200px)', offset: 0.4},
      { transform: 'translateX(-200px)', offset: 0.5},
      { transform: 'translateX(-200px)', offset: 0.6},
      { transform: 'translateY(200px)', offset: 0.7},
      { transform: 'translateY(200px)', offset: 0.8},
      { transform: 'translateY(0px)', offset: 0.9} // 終了時の状態
    ], 
    // タイミングに関する設定
    {
      fill: 'backwards', // 再生前後の状態（再生前、開始時の状態を適用）
      duration: 50000, // 再生時間（ミリ秒）
      iterations: Infinity,  // アニメーションの繰り返し回数（ずっと繰り返す）
    },
  );

  catImage.addEventListener('touchstart', touchStartHandler);
  document.addEventListener('touchmove', touchMoveHandler);
  document.addEventListener('touchend', touchEndHandler);
});