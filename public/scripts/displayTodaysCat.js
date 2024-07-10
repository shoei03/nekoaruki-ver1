// 画像ファイルのパスを含む配列
const catImages = [
  'src/nekorobi_neko_1.png',
  'src/わだにゃん.png',
  'src/cat_8.png',
  // 他の画像ファイルのパスを追加
];

document.addEventListener('DOMContentLoaded', () => {
  // 配列からランダムに画像のパスを選択
  const selectedImage = catImages[Math.floor(Math.random() * catImages.length)];

  // 選択された画像のパスをimg要素のsrc属性に設定
  const catImageElement = document.querySelector('.todays-cat img');
  if (catImageElement) {
    catImageElement.src = selectedImage;
  }
});