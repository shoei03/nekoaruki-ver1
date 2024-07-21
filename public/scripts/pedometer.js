import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

// 定数
const GRAVITY_MIN = 9.8;
const GRAVITY_MAX = 12.0;

// グローバル変数
let firstGoal, secondGoal;

// DOM要素
const elements = {
  goalCount: document.getElementById("goalCount"),
  goalMessage: document.getElementById("goal-message"),
  filteredCat: document.querySelector(".filtered-cat"),
  message: document.querySelector(".message"),
  stepCount: document.getElementById("stepCount")
};

// 初期化関数
function initializeApp() {
  document.addEventListener('DOMContentLoaded', loadUserGoals);
  window.addEventListener("devicemotion", handleDeviceMotion);
}

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

// ユーザーの目標をロードする
async function loadUserGoals() {
  const userId = await getCurrentUserId();
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      ({ firstGoal, secondGoal } = docSnap.data()); // 更新
      console.log('ユーザーデータが取得されました:', docSnap.data());
      updateGoalCount(0, firstGoal, secondGoal); // 初期歩数を0として更新
    } else {
      console.log('ユーザーデータが存在しません');
    }
  } catch (error) {
    console.error('歩数の取得中にエラーが発生しました:', error);
  }
}

// 歩数と目標を更新する
function updateGoalCount(steps, firstGoal, secondGoal) {
  elements.stepCount.textContent = steps;
  if (steps >= secondGoal) {
    elements.message.innerHTML = "おめでとう！<br>ねこをコレクションできました！";
  } else if (steps >= firstGoal) {
    elements.goalMessage.textContent = "歩でねこをコレクションできるよ～";
    elements.filteredCat.style.filter = 'blur(0)';
    elements.goalCount.textContent = secondGoal - steps;
  } else {
    elements.goalCount.textContent = firstGoal - steps;
  }
}

// デバイスの動きを処理する
function handleDeviceMotion(e) {
  e.preventDefault();
  const acc = calculateAcceleration(e.accelerationIncludingGravity);
  processStepDetection(acc);
}

// 加速度を計算する
function calculateAcceleration(ag) {
  return Math.sqrt(ag.x ** 2 + ag.y ** 2 + ag.z ** 2);
}

// 歩数検出を処理する
let isWalking = false;
let steps = 0;
function processStepDetection(acc) {
  if (isWalking) {
    if (acc < GRAVITY_MIN) {
      steps++;
      isWalking = false;
      updateGoalCount(steps, firstGoal, secondGoal);
    }
  } else {
    if (acc > GRAVITY_MAX) {
      isWalking = true;
    }
  }
}

initializeApp();