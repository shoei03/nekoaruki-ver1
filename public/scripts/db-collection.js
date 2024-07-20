import { auth, db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
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
const fetchData = async () => {
    // 現在の月の日数を取得
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // カレンダーの日付要素を生成
    generateCalendarDays(daysInMonth);

    // Firebaseからデータを取得
    const userId = await getCurrentUserId();
    const userDoc = await getDocs(collection(db, `users/${userId}/cats`));
    userDoc.forEach((doc) => {
        const data = doc.data();
        const date = doc.id; // ドキュメントIDが日付と仮定
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

// ページ読み込み時にfetchDataを呼び出す
document.addEventListener("DOMContentLoaded", fetchData);
