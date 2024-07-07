// 重力加速度のしきい値
var GRAVITY_MIN = 9.8;
var GRAVITY_MAX = 12.0;
// 歩数
var _step = 0;
// 現在歩いているかどうか
var _isStep = false;
// ねこを表示する目標歩数を取得
var firstGoal;
// ねこをコレクションできる目標歩数を取得
var secondGoal;

function initialize() {
  // デバイスの加速度センサーの情報を取得します
  window.addEventListener("devicemotion", onDeviceMotion);
}

function onDeviceMotion(e) {
  e.preventDefault();
  // 重力加速度を取得
  var ag = e.accelerationIncludingGravity;
  // 重力加速度ベクトルの大きさを取得
  var acc = Math.sqrt(ag.x * ag.x + ag.y * ag.y + ag.z * ag.z);

  if (_isStep) {
    // 歩行中にしきい値よりも低ければ一歩とみなす
    if (acc < GRAVITY_MIN) {
      _step++;
      _isStep = false;
      updateStepCount();
      updateGoalCount();
    }
  } else {
    // しきい値よりも大きければ歩いているとみなす
    if (acc > GRAVITY_MAX) {
      _isStep = true;
    }
  }
}

function updateStepCount() {
  var stepCountElement = document.getElementById("stepCount");
  stepCountElement.textContent = _step;
}

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
            firstGoal = steps.firstGoal;
            secondGoal = steps.secondGoal;
            console.log('ユーザーデータが取得されました:', steps);
        } else {
            console.log('ユーザーデータが存在しません');
        }
    })
    .catch((error) => {
        console.error('歩数の取得中にエラーが発生しました:', error);
    });
}


const goalCountElement = document.getElementById("goalCount");
const goalCountMse = document.getElementById("goal-message");
const filteredCat = document.getElementsByClassName("filtered-cat");
if (firstGoal <= _step) {
  goalCountMse.textContent = "歩でねこをコレクションできるよ～";
  filteredCat.style.filter = 'blur(0)';
  function updateGoalCount() {
    goalCountElement.textContent = secondGoal - _step;
    return;
  }
} else {
  function updateGoalCount() {
    goalCountElement.textContent = firstGoal  - _step;
    return;
  }
}

// DOMの読み込みが完了したら、loadSteps関数を呼び出す
document.addEventListener('DOMContentLoaded', loadSteps);

initialize();