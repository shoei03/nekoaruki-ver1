import { db } from "./firebase-config.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// 重力加速度のしきい値
const GRAVITY_MIN = 9.8;
const GRAVITY_MAX = 12.0;
// 歩数
let _step = 0;
// 現在歩いているかどうか
let _isStep = false;
// ねこを表示する目標歩数を取得
let firstGoal;
// ねこをコレクションできる目標歩数を取得
let secondGoal;

// DOM要素
const goalCountElement = document.getElementById("goalCount");
const goalMessageElement = document.getElementById("goal-message");
const filteredCat = document.querySelector(".filtered-cat");

function initialize() {
  // デバイスの加速度センサーの情報を取得します
  window.addEventListener("devicemotion", onDeviceMotion);
}

function onDeviceMotion(e) {
  e.preventDefault();
  // 重力加速度を取得
  const ag = e.accelerationIncludingGravity;
  // 重力加速度ベクトルの大きさを取得
  const acc = Math.sqrt(ag.x * ag.x + ag.y * ag.y + ag.z * ag.z);

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
  const stepCountElement = document.getElementById("stepCount");
  stepCountElement.textContent = _step;
}

async function loadSteps() {
  try {
    const docRef = doc(db, 'goals', 'userGoals');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      firstGoal = data.firstGoal;
      secondGoal = data.secondGoal;
      updateGoalCount();
      console.log('ユーザーデータが取得されました:', data);
    } else {
      console.log('ユーザーデータが存在しません');
    }
  } catch (error) {
    console.error('歩数の取得中にエラーが発生しました:', error);
  }
}

function updateGoalCount() {
  if (_step >= firstGoal) {
    goalMessageElement.textContent = "歩でねこをコレクションできるよ～";
    filteredCat.style.filter = 'blur(0)';
  } else {
    goalCountElement.textContent = firstGoal - _step;
  }
}

// DOMの読み込みが完了したら、loadSteps関数を呼び出す
document.addEventListener('DOMContentLoaded', loadSteps);

initialize();