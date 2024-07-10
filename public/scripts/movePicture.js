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
      { transform: 'translate(0, 0)', offset: 0},// 開始時の状態
      { transform: 'translate(100px, -100px)', offset: 0.05},
      { transform: 'translate(100px, -100px)', offset: 0.1},
      { transform: 'translate(0, -200px)', offset: 0.2},
      { transform: 'translate(0, -200px)', offset: 0.25},
      { transform: 'translate(-200px, 0)', offset: 0.35},
      { transform: 'translate(-200px, 0)', offset: 0.4},
      { transform: 'translate(0, 200px)', offset: 0.5},
      { transform: 'translate(0, 200px)', offset: 0.55},
      { transform: 'translate(100px, 100px)', offset: 0.65},
      { transform: 'translate(100px, 100px)', offset: 0.75},
      { transform: 'translate(0, 0)', offset: 0.8} // 終了時の状態
    ], 
    // タイミングに関する設定
    {
      fill: 'backwards', // 再生前後の状態（再生前、開始時の状態を適用）
      duration: 30000, // 再生時間（ミリ秒）
      iterations: Infinity,  // アニメーションの繰り返し回数（ずっと繰り返す）
    },
  );

  catImage.addEventListener('touchstart', touchStartHandler);
  document.addEventListener('touchmove', touchMoveHandler);
  document.addEventListener('touchend', touchEndHandler);
});