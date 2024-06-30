// 重力加速度のしきい値
var GRAVITY_MIN = 9.8;
var GRAVITY_MAX = 12.0;
// 歩数
var _step = 0;
// 現在歩いているかどうか
var _isStep = false;

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

function updateGoalCount() {
  var goalCountElement = document.getElementById("goalCount");
  goalCountElement.textContent = 2000  - _step;
}

initialize();