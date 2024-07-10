import { db } from "./firebase-config.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// 画像ファイルのパスを含む配列
const catImages = [
  'src/nekorobi_neko_1.png',
  'src/わだにゃん.png',
  'src/cat_8.png',
  // 他の画像ファイルのパスを追加
];

// 画像をランダムに表示する
document.addEventListener('DOMContentLoaded', () => {
  // 配列からランダムに画像のパスを選択
  const selectedImage = catImages[Math.floor(Math.random() * catImages.length)];

  // 選択された画像のパスをimg要素のsrc属性に設定
  const catImageElement = document.querySelector('.todays-cat img');
  if (catImageElement) {
    catImageElement.src = selectedImage;
  }
});

// データをfirebaseに保存する
const saveData = async () => {
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const catName = "ねこ";
  const catImageURL = "src/nekorobi_neko_1.png";

  await setDoc(doc(db, "cats", date), {
      catName: catName,
      catImageURL: catImageURL,
  });
}

// ページ読み込み時にsaveDataを呼び出す
document.addEventListener("DOMContentLoaded", saveData);