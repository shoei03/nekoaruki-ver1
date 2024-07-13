import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

// ログイン機能
const loginButton = document.getElementById('login-button');
if (loginButton) {
  loginButton.addEventListener('click', async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功
      console.log("ログイン成功!");
      window.location.href = "index.html";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ログイン失敗時のエラー処理
      alert(`エラー: ${errorMessage}`);
    }
  });
}

// ログアウト機能
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      // ログアウト成功
      console.log("ログアウトしました");
      window.location.href = "login.html"; // ログインページにリダイレクト
    } catch (error) {
      // エラー処理
      console.error("ログアウトエラー", error);
    }
  });
}

// ユーザーのログイン状態の監視
const authContainer = document.querySelectorAll('.auth-container');
document.addEventListener('DOMContentLoaded', async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ユーザーがログインしている場合の処理
      console.log(`ユーザーがログインしています: ${user.email}`);
      logoutButton.style.display = 'block'; // ログアウトボタンを表示
      authContainer.forEach((container) => {
        container.style.display = 'none'; // ログインフォームを非表示
      });
    } else {
      // ユーザーがログアウトしている場合の処理
      console.log("ユーザーがログアウトしています。");
      logoutButton.style.display = 'none'; // ログアウトボタンを非表示
    }
  });
});