// Firestoreの初期化（firebase-config.jsで既に行われていると仮定）
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', async () => {
  const catImages = [
    'src/nekorobi_neko_1.png',
    'src/わだにゃん.png',
    'src/cat_8.png',
    // 他の画像ファイルのパスを追加
  ];

  // 配列からランダムに画像のパスを選択
  const selectedImage = catImages[Math.floor(Math.random() * catImages.length)];

  // 選択された画像のパスをimg要素のsrc属性に設定
  const catImageElement = document.querySelector('.todays-cat img');
  if (catImageElement) {
    catImageElement.src = selectedImage;
    try {
      // Firestoreに選択された画像のパスを保存
      await addDoc(collection(db, "cats"), {
        imagePath: selectedImage,
        timestamp: new Date() // 保存日時も記録
      });
      console.log("Document successfully written!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});