import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { auth, db } from "./firebase-config.js";

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

// カレンダーの日付要素を生成する関数
const generateCalendarDays = (daysInMonth) => {
    const calendarElement = document.querySelector('.calendar');
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.dataset.day = day;

        // 動的に::before擬似要素のcontentを設定
        const style = document.createElement('style');
        style.textContent = `.day[data-day="${day}"]::before { content: "${day}"; }`;
        document.head.appendChild(style);

        calendarElement.appendChild(dayElement);
    }
};

// データを取得してカレンダーに表示する関数
const showCatCollection = (catsDocs) => {
    catsDocs.forEach((catsdoc) => {
        const data = catsdoc.data();
        const date = catsdoc.id;
        const catImageURL = data.catImageURL;

        // 日付に対応するカレンダーの要素を見つける
        const day = new Date(date).getDate();
        const dayElement = document.querySelector(`.calendar .day[data-day="${day}"]`);
        if (dayElement) {
            // 画像を追加
            const img = document.createElement("img");
            img.src = catImageURL;
            img.className = "cat-icon";
            dayElement.appendChild(img);
        }
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    // 現在の月の日数を取得
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    // カレンダーの日付要素を生成
    generateCalendarDays(daysInMonth);

    // Firestoreからデータを取得
    const userId = await getCurrentUserId();
    const catsDocs = await getDocs(collection(db, `users/${userId}/cats`));
    // 取得したねこをカレンダーに表示
    showCatCollection(catsDocs);
})
