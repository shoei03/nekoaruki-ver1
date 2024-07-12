import { db } from "./firebase-config.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const saveNotificationTime = async (startTime, endTime, id) => {
  try {
    console.log('Attempting to save notification time');
    await setDoc(doc(db, 'notificationSettings', id), { startTime, endTime });
    console.log(`通知時間 (ID: ${id}) が正常に保存されました`);
  } catch (error) {
    console.error(`通知時間 (ID: ${id}) の保存中にエラーが発生しました:`, error);
    throw error;
  }
};

const deleteNotificationTime = async (id) => {
  try {
    await deleteDoc(doc(db, 'notificationSettings', id));
    console.log(`通知時間 (ID: ${id}) が正常に削除されました`);
  } catch (error) {
    console.error(`通知時間 (ID: ${id}) の削除中にエラーが発生しました:`, error);
    throw error;
  }
};

const getAllNotificationTimes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'notificationSettings'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('通知時間の取得中にエラーが発生しました:', error);
    throw error;
  }
};

const createNotificationTimeCard = (id, startTime, endTime) => {
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
        <span class="date">日</span>
        <span class="date">月</span>
        <span class="date">火</span>
        <span class="date">水</span>
        <span class="date">木</span>
        <span class="date">金</span>
        <span class="date">土</span>
      </div>
      <button class="delete-button">削除</button>
    </div>
  `;

  const startTimeInput = card.querySelector('input[name="start-time"]');
  const endTimeInput = card.querySelector('input[name="end-time"]');
  const deleteButton = card.querySelector('.delete-button');
  const dateElements = card.querySelectorAll('.date');

  startTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput));
  endTimeInput.addEventListener('change', () => handleTimeChange(id, startTimeInput, endTimeInput));
  deleteButton.addEventListener('click', () => handleDelete(id, card));
  dateElements.forEach(dateElement => {
    dateElement.addEventListener('click', () => dateElement.classList.toggle('selected'));
  });

  return card;
};

const handleTimeChange = async (id, startTimeInput, endTimeInput) => {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (startTime && endTime) {
    try {
      await saveNotificationTime(startTime, endTime, id);
    } catch (error) {
      console.error('通知時間の保存に失敗しました:', error);
    }
  }
};

const handleDelete = async (id, card) => {
  try {
    await deleteNotificationTime(id);
    card.remove();
  } catch (error) {
    console.error('通知時間の削除に失敗しました:', error);
  }
};

const addNewNotificationTime = async () => {
  const id = Date.now().toString();
  const startTime = "09:00";
  const endTime = "17:00";

  try {
    await saveNotificationTime(startTime, endTime, id);
    const card = createNotificationTimeCard(id, startTime, endTime);
    document.querySelector('.setting-container').appendChild(card);
  } catch (error) {
    console.error('新しい通知時間の追加に失敗しました:', error);
  }
};

const loadExistingNotificationTimes = async () => {
  try {
    const times = await getAllNotificationTimes();
    times.forEach(time => {
      const card = createNotificationTimeCard(time.id, time.startTime, time.endTime);
      document.querySelector('.setting-container').appendChild(card);
    });
  } catch (error) {
    console.error('既存の通知時間の読み込みに失敗しました:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadExistingNotificationTimes();
  const addButton = document.querySelector('.add-button');
  addButton.addEventListener('click', addNewNotificationTime);
});