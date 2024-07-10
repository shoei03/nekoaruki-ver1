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
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  // 年月日を基にしたシード値を生成
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  // シード値を基にして乱数を生成（疑似的な方法）
  const pseudoRandom = Math.abs(Math.sin(seed)) * 10000 % 1;
  // 乱数を基にして配列のインデックスを決定
  const index = Math.floor(pseudoRandom * catImages.length);
  const selectedImage = catImages[index];

  // ねこを画面に表示する
  const catImageElement = document.querySelector('.todays-cat img');
  if (catImageElement) {
    catImageElement.src = selectedImage;
  }

  // Firestoreにデータを保存
  const catName = "ねこ";
  const catImageURL = selectedImage;
  setDoc(doc(db, "cats", date), {
      catName: catName,
      catImageURL: catImageURL,
  });
});
