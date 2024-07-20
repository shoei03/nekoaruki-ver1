import { auth, db } from "./firebase-config.js";
import { collection, doc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

const getCurrentUserId = () => new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
      if (!user) {
          console.log('ユーザーがログインしていません。');
          resolve(null);
      } else {
          resolve(user.uid);
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  loadExistingNotificationTimes();
  const addButton = document.querySelector('.add-button');
  addButton.addEventListener('click', addNewNotificationTime);
});

// データを保存し、カードを作成する関数
const addNewNotificationTime = async () => {
  const id = Date.now().toString();
  const startTime = "09:00";
  const endTime = "17:00";
  const days = []; // 空の配列または適切な値を持つ配列

  try {
    await saveNotificationTime(startTime, endTime, days, id);
    const card = createNotificationTimeCard(id, startTime, endTime, days);
    document.querySelector('.setting-container').appendChild(card);
  } catch (error) {
    console.error('新しい通知時間の追加に失敗しました:', error);
  }
};


// データを読み込み、カードを作成
const loadExistingNotificationTimes = async () => {
  try {
    const times = await getAllNotificationTimes();
    times.forEach(time => {
      const card = createNotificationTimeCard(time.id, time.startTime, time.endTime, time.days);
      document.querySelector('.setting-container').appendChild(card);
    });
  } catch (error) {
    console.error('既存の通知時間の読み込みに失敗しました:', error);
  }
};

// データを読み込む関数
const getAllNotificationTimes = async () => {
  const userId = await getCurrentUserId();
  try {
    const querySnapshot = await getDocs(collection(db, `users/${userId}/notificationSettings`));
    const settings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    settings.forEach(setting => {
      console.log(`ID: ${setting.id}, Start Time: ${setting.startTime}, End Time: ${setting.endTime}, Days: ${setting.days.join(', ')}`);
    });
    return settings;
  } catch (error) {
    console.error('通知時間の取得中にエラーが発生しました:', error);
    throw error;
  }
};

// カードを作成し、データを入れる
const createNotificationTimeCard = (id, startTime, endTime, days = []) => {
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
        <span class="date ${days.includes('日') ? 'selected' : ''}">日</span>
        <span class="date ${days.includes('月') ? 'selected' : ''}">月</span>
        <span class="date ${days.includes('火') ? 'selected' : ''}">火</span>
        <span class="date ${days.includes('水') ? 'selected' : ''}">水</span>
        <span class="date ${days.includes('木') ? 'selected' : ''}">木</span>
        <span class="date ${days.includes('金') ? 'selected' : ''}">金</span>
        <span class="date ${days.includes('土') ? 'selected' : ''}">土</span>
      </div>
      <div class="delete-box">
        <img src="src/delete.png" alt="削除" class="delete-icon">
        <button class="btn btn-danger delete-button">削除</button>
      </div>
    </div>
  `;

  const startTimeInput = card.querySelector('input[name="start-time"]');
  const endTimeInput = card.querySelector('input[name="end-time"]');
  const deleteButton = card.querySelector('.delete-button');
  const dateElements = card.querySelectorAll('.date');

  startTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput, getSelectedDays()));
  endTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput, getSelectedDays()));
  deleteButton.addEventListener('click', () => handleDelete(id, card));
  dateElements.forEach(dateElement => {
    dateElement.addEventListener('click', () => {
      dateElement.classList.toggle('selected');
      saveData(); // 曜日が変更されたらデータを保存
    });
  });

  // 選択された曜日を取得し、データベースに保存する新しい関数
  const saveData = async () => {
    const selectedDays = getSelectedDays();
    await saveNotificationTime(startTimeInput.value, endTimeInput.value, selectedDays, id);
  };

  // 選択された曜日を取得する関数
  const getSelectedDays = () => {
    return Array.from(dateElements).filter(element => element.classList.contains('selected')).map(element => element.textContent);
  };

  return card;
};

// 時間を更新する関数
const handleTimeChange = async (id, startTimeInput, endTimeInput, selectedDays) => {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (startTime && endTime && selectedDays.length > 0) {
    try {
      await saveNotificationTime(startTime, endTime, selectedDays, id);
    } catch (error) {
      console.error('通知時間の保存に失敗しました:', error);
    }
  }
};

// 更新したデータを保存する関数
const saveNotificationTime = async (startTime, endTime, days, id) => {
  const userId = await getCurrentUserId();
  try {
    await setDoc(doc(db, `users/${userId}/notificationSettings`, id), { startTime, endTime, days });
    console.log(`通知時間 (ID: ${id}) が正常に保存されました、曜日: ${days}`);
  } catch (error) {
    console.error(`通知時間 (ID: ${id}) の保存中にエラーが発生しました:`, error);
    throw error;
  }
};

// カードを削除する関数
const handleDelete = async (id, card) => {
  try {
    await deleteNotificationTime(id);
    card.remove();
  } catch (error) {
    console.error('通知時間の削除に失敗しました:', error);
  }
};

// データを削除する関数
const deleteNotificationTime = async (id) => {
  const userId = await getCurrentUserId();
  try {
    await deleteDoc(doc(db, `users/${userId}/notificationSettings`, id));
    console.log(`通知時間 (ID: ${id}) が正常に削除されました`);
  } catch (error) {
    console.error(`通知時間 (ID: ${id}) の削除中にエラーが発生しました:`, error);
    throw error;
  }
};
