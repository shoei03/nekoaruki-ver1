import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { db, storage } from "./firebase-config.js";
import { getCurrentUserId } from "./getCurrentUserId.js";

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
            const catImg = document.createElement("img");
            catImg.src = catImageURL;
            catImg.className = "cat-icon";
            dayElement.appendChild(catImg);
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

    // カレンダーの日付要素にクリックイベントを追加
    const calendarDays = document.querySelectorAll(".day");
    calendarDays.forEach(day => {
        day.addEventListener("click", (event) => {
            const activeDay = document.querySelector(".day.enlarge");
            if (activeDay && activeDay !== day) {
                activeDay.classList.remove("enlarge");
            }
            day.classList.toggle("enlarge");
            if (day.classList.contains("enlarge")) {
                day.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            }
        });
    });

    getImagesFromStorage();
})

function extractDate(url) {
    // 正規表現を使って日付部分を抽出
    const datePattern = /(\d{4})-(\d{2})-(\d{2})T/;
    const match = url.match(datePattern);

    if (match) {
        const year = match[1];
        const month = parseInt(match[2], 10); // 文字列の月を整数に変換
        const day = parseInt(match[3], 10);

        // 月が0から始まる場合の変換
        const formattedMonth = day.toString(); // 先頭の0を削除

        return {
            year: year,
            month: formattedMonth,
            day: day
        };
    } else {
        throw new Error("日付が含まれていないURLです。");
    }
}

// Firebase Storageから画像を取得して表示する関数
async function getImagesFromStorage() {
    const userId = await getCurrentUserId();
    const imagesRef = ref(storage, `photos/${userId}/`);
    try {
        const result = await listAll(imagesRef);
        if (result.items.length === 0) {
            console.log("No images found in the photos folder.");
            return;
        }
        result.items.forEach(async (imageRef) => {
            const photoImageUrl = await getDownloadURL(imageRef);
            const date = extractDate(photoImageUrl);
            const day = date.day;
            document.querySelector(`.calendar .day[data-day="${day}"]`).style.backgroundImage = `url(${photoImageUrl})`;
        });
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}