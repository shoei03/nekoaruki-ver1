// Firestoreの参照を取得
const db = firebase.firestore();

// notification-timeの入力フィールドを取得
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');

console.log('database.js is loaded'); // スクリプトが読み込まれたことを確認

// 時間が変更されたときの処理を追加
function handleTimeChange(event) {
  console.log('handleTimeChange called'); // この関数が呼び出されたことを確認
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  console.log('Start time:', startTime); // 開始時間をログ出力
  console.log('End time:', endTime); // 終了時間をログ出力

  // 両方の時間が入力されている場合のみ保存
  if (startTime && endTime) {
    saveNotificationTime(startTime, endTime);
  }
}

// データベースに通知時間を保存する関数
function saveNotificationTime(startTime, endTime) {
  console.log('Attempting to save notification time'); // 保存を試みていることをログ出力
  db.collection('notificationSettings').doc('timeRange').set({
    startTime: startTime,
    endTime: endTime
  })
  .then(() => {
    console.log('通知時間が正常に保存されました');
  })
  .catch((error) => {
    console.error('通知時間の保存中にエラーが発生しました:', error);
  });
}

// イベントリスナーを追加
startTimeInput.addEventListener('change', handleTimeChange);
endTimeInput.addEventListener('change', handleTimeChange);

console.log('Event listeners added'); // イベントリスナーが追加されたことを確認