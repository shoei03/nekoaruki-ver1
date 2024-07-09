import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

// ログイン機能
const authButton = document.getElementById('login-button');
if (authButton) {
  authButton.addEventListener('click', () => {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ログイン成功
        console.log("ログイン成功!");
        window.location.href = "index.html";
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ログイン失敗時のエラー処理
        alert("エラー: " + errorMessage);
      });
  });
}

// ログアウト機能
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
      // ログアウト成功
      console.log("ログアウトしました");
      window.location.href = "login.html"; // ログインページにリダイレクト
    }).catch((error) => {
      // エラー処理
      console.error("ログアウトエラー", error);
    });
  });
}

// ユーザーのログイン状態の監視
document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ユーザーがログインしている場合の処理
      console.log("ユーザーがログインしています:", user.email);
      logoutButton.style.display = 'block'; // ログアウトボタンを表示
    } else {
      // ユーザーがログアウトしている場合の処理
      console.log("ユーザーがログアウトしています。");
      logoutButton.style.display = 'none'; // ログアウトボタンを非表示
    }
  });
});
