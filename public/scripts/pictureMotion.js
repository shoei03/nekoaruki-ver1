const start = document.getElementById('start'); // 開始ボタン
const image = document.getElementById('image'); // ロゴ画像

// スタートボタンをクリックしたら
start.addEventListener('click', () => {
  // 画像を左端から200px右に動かす
  image.animate(
    // 途中の状態を表す配列
    [
      { transform: 'translateX(0)'}, // 開始時の状態（左端）
      { transform: 'translateX(200px)' } // 終了時の状態（左端から200pxの位置）
    ], 
    // タイミングに関する設定
    {
      fill: 'backwards', // 再生前後の状態（再生前、開始時の状態を適用）
      duration: 1000, // 再生時間（1000ミリ秒）
    },
  );
});