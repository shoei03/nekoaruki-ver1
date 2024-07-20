import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

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

const getRecentDates = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

const getRecentCats = async (userId, recentDates) => {
  const catsCollectionRef = collection(db, `users/${userId}/cats`);
  const promises = recentDates.map(async (date) => {
    const catDocRef = doc(catsCollectionRef, date);
    const catDocSnap = await getDoc(catDocRef);
    if (catDocSnap.exists()) {
      return { date, ...catDocSnap.data() };
    } else {
      return null;
    }
  });
  const catsData = await Promise.all(promises);
  return catsData.filter(cat => cat !== null);
};

const displayCatsFromLastFourDays = async () => {
  const userId = await getCurrentUserId();
  if (userId) {
    const recentDates = getRecentDates(4);
    const recentCats = await getRecentCats(userId, recentDates);
    const picture = document.querySelector(".picture");
    recentCats.forEach(cat => {
      console.log(`Date: ${cat.date}, Cat Image URL: ${cat.catImageURL}`);
      const catElement = document.createElement("div");
      catElement.innerHTML = `
        <img src="${cat.catImageURL}">
      `;
      picture.appendChild(catElement);
    });
  } else {
    console.error('ユーザーIDの取得に失敗しました。');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  displayCatsFromLastFourDays();
});
