// Firestoreの参照を取得
const db = firebase.firestore();

// ユーザーデータを保存する関数
function saveUserData(userId, data) {
  return db.collection('users').doc(userId).set(data, { merge: true });
}

// ユーザーデータを取得する関数
function getUserData(userId) {
  return db.collection('users').doc(userId).get();
}

// ユーザーの歩数を更新する関数
function updateUserSteps(userId, steps) {
  return db.collection('users').doc(userId).update({
    totalSteps: firebase.firestore.FieldValue.increment(steps)
  });
}

// ユーザー情報を画面に表示する関数
function displayUserInfo(user) {
  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement) {
    userInfoElement.innerHTML = `
      <p>ようこそ、${user.displayName || '名無しさん'}さん</p>
      <p>ユーザーID: ${user.uid}</p>
    `;
  }
}

// ユーザー情報をクリアする関数
function clearUserInfo() {
  const userInfoElement = document.getElementById('user-info');
  if (userInfoElement) {
    userInfoElement.innerHTML = '';
  }
}