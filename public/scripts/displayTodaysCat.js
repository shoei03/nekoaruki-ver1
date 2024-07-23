import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

const getCurrentUserId = () => {
  return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
          if (!user) {
              reject('ユーザーがログインしていません。');
              window.location.href = '../login.html';
          } else {
              resolve(user.uid);
          }
      })
  })
}

// 画像ファイルのパスを含む配列
const catImages = [
  'src/わだにゃん.png',
  'src/nekorobi_neko_1.png',
  'src/nekoaruki_haiiro1.png',
  'src/nekoaruki_haiiro3.png',
  'src/nekoaruki_haiiro4.png',
  'src/nekoaruki_haiiro5.png',
  // 他の画像ファイルのパスを追加
];

// 画像をランダムに表示する
document.addEventListener('DOMContentLoaded', async () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const date = `${yyyy}-${mm}-${dd}`;
  // 年月日を基にしたシード値を生成
  const seed = yyyy * 10000 + (mm + 1) * 100 + dd;
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

  const userId = await getCurrentUserId();
  // Firestoreにデータを保存
  // 目標歩数を達成してから保存されるように修正する必要あり
  const catImageURL = selectedImage;
  setDoc(doc(db, `users/${userId}/cats`, date), {
      catImageURL: catImageURL,
  });
});
