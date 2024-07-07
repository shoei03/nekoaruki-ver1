// Firestoreの参照を取得
const db = firebase.firestore();

console.log('walking-database.js is loaded');

// 歩数を取得する関数
function loadSteps() {
    return db.collection('goals').doc('userGoals').get()
    .then((doc) => {
        if (doc.exists) {
            const steps = doc.data();
            document.getElementById('goalCount').textContent = steps.firstGoal;
        } else {
            console.log('ユーザーデータが存在しません');
        }
    })
    .catch((error) => {
        console.error('歩数の取得中にエラーが発生しました:', error);
    });
}

// DOMの読み込みが完了したら、loadSteps関数を呼び出す
document.addEventListener('DOMContentLoaded', loadSteps);
