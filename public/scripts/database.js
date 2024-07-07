// Firestoreの参照を取得
const db = firebase.firestore();

console.log('database.js is loaded');

// 通知時間設定を保存する関数
function saveNotificationTime(startTime, endTime, id) {
  console.log('Attempting to save notification time');
  return db.collection('notificationSettings').doc(id).set({
    startTime: startTime,
    endTime: endTime
  })
  .then(() => {
    console.log(`通知時間 (ID: ${id}) が正常に保存されました`);
  })
  .catch((error) => {
    console.error(`通知時間 (ID: ${id}) の保存中にエラーが発生しました:`, error);
    throw error; // エラーを再スローして呼び出し元で処理できるようにする
  });
}

// 通知時間設定を削除する関数
function deleteNotificationTime(id) {
  return db.collection('notificationSettings').doc(id).delete()
    .then(() => {
      console.log(`通知時間 (ID: ${id}) が正常に削除されました`);
    })
    .catch((error) => {
      console.error(`通知時間 (ID: ${id}) の削除中にエラーが発生しました:`, error);
      throw error;
    });
}

// 全ての通知時間設定を取得する関数
function getAllNotificationTimes() {
  return db.collection('notificationSettings').get()
    .then((querySnapshot) => {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    })
    .catch((error) => {
      console.error('通知時間の取得中にエラーが発生しました:', error);
      throw error;
    });
}

// 通知時間設定のカードを作成する関数
function createNotificationTimeCard(id, startTime, endTime) {
  const card = document.createElement('div');
  card.className = 'card notification-time-card';
  card.innerHTML = `
    <div class="card-content">
      <div class="notification-time">
        <input type="time" name="start-time" value="${startTime}">
        <span>～</span>
        <input type="time" name="end-time" value="${endTime}">
      </div>
      <div class="days">
        <span class="day">日</span>
        <span class="day">月</span>
        <span class="day">火</span>
        <span class="day">水</span>
        <span class="day">木</span>
        <span class="day">金</span>
        <span class="day">土</span>
      </div>
      <button class="delete-button">削除</button>
    </div>
  `;

  const startTimeInput = card.querySelector('input[name="start-time"]');
  const endTimeInput = card.querySelector('input[name="end-time"]');
  const deleteButton = card.querySelector('.delete-button');
  const dayElements = card.querySelectorAll('.day');

  startTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput));
  endTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput));
  deleteButton.addEventListener('click', () => handleDelete(id, card));
  dayElements.forEach(dayElement => {
    dayElement.addEventListener('click', () => dayElement.classList.toggle('selected') );
  });

  return card;
}

// 時間変更のハンドラ
function handleTimeChange(id, startTimeInput, endTimeInput) {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (startTime && endTime) {
    saveNotificationTime(startTime, endTime, id)
      .catch(error => {
        console.error('通知時間の保存に失敗しました:', error);
        // エラーメッセージを表示するなどのエラーハンドリングをここに追加
      });
  }
}

// 削除ボタンのハンドラ
function handleDelete(id, card) {
  deleteNotificationTime(id)
    .then(() => {
      card.remove(); // DOMから要素を削除
    })
    .catch(error => {
      console.error('通知時間の削除に失敗しました:', error);
      // エラーメッセージを表示するなどのエラーハンドリングをここに追加
    });
}

// 新しい通知時間設定を追加する関数
function addNewNotificationTime() {
  const id = Date.now().toString(); // ユニークなIDを生成
  const startTime = "09:00";
  const endTime = "17:00";

  saveNotificationTime(startTime, endTime, id)
    .then(() => {
      const card = createNotificationTimeCard(id, startTime, endTime);
      document.querySelector('.setting-container').appendChild(card);
    })
    .catch(error => {
      console.error('新しい通知時間の追加に失敗しました:', error);
      // エラーメッセージを表示するなどのエラーハンドリングをここに追加
    });
}

// 既存の通知時間設定を読み込む
function loadExistingNotificationTimes() {
  getAllNotificationTimes()
    .then(times => {
      times.forEach(time => {
        const card = createNotificationTimeCard(time.id, time.startTime, time.endTime);
        document.querySelector('.setting-container').appendChild(card);
      });
    })
    .catch(error => {
      console.error('既存の通知時間の読み込みに失敗しました:', error);
      // エラーメッセージを表示するなどのエラーハンドリングをここに追加
    });
}

// DOMの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', function() {
  loadExistingNotificationTimes();

  // 追加ボタンにイベントリスナーを設定
  const addButton = document.querySelector('.add-button');
  addButton.addEventListener('click', addNewNotificationTime);
});