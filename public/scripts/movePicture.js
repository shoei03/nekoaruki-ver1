import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

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
      picture.innerHTML += `
        <img src="${cat.catImageURL}" id="movableCat">
      `;
    });
  } else {
    console.error('ユーザーIDの取得に失敗しました。');
  }
};

function movePicture() {
var catImages = document.querySelectorAll('.picture img');
var isDragging = false;
var startX, startY, initialX, initialY;

catImages.forEach((catImage) => { 
    // ウィンドウの大きさを取得
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    
    // 初期位置を設定
    catImage.style.position = 'absolute';
    catImage.style.left = '0px';
    catImage.style.top = '0px';
    
    var touchStartHandler = function(e) {
      if (e.touches.length === 1) { // シングルタッチのみを処理
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    
        // 画像の左上の座標を左上の原点として取得
        initialX = catImage.offsetLeft;
        initialY = catImage.offsetTop;
        catImage.style.cursor = 'grabbing';
      }
    };
    
    var touchMoveHandler = function(e) {
      if (isDragging) {
        var currentX = e.touches[0].clientX;
        var currentY = e.touches[0].clientY;
        var deltaX = currentX - startX;
        var deltaY = currentY - startY;
        var newLeft = initialX + deltaX;
        var newTop = initialY + deltaY;
    
        // 画面の外に出ないように制限を設ける
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (windowWidth - 100 < newLeft) newLeft = windowWidth - 100;
        if (windowHeight - 100 < newTop) newTop = windowHeight - 100;
    
        catImage.style.left = newLeft + 'px';
        catImage.style.top = newTop + 'px';
      }
    };
    
    var touchEndHandler = function() {
      isDragging = false;
      catImage.style.cursor = 'grab';
    };
    
    // 位置を制限する関数
    function getLimitedTransform(transform) {
      var translateValues = transform.match(/-?\d+px/g);
      if (!translateValues || translateValues.length !== 2) {
        // マッチしなかった場合はデフォルト値を設定
        return transform;
      }
    
      translateValues = translateValues.map(value => parseInt(value, 10));
      var translateX = translateValues[0];
      var translateY = translateValues[1];
    
      var limitedX = translateX;
      var limitedY = translateY;
    
      if (translateX + initialX < 0) limitedX = -initialX;
      if (translateY + initialY < 0) limitedY = -initialY;
      if (translateX + initialX + catImage.offsetWidth > windowWidth) limitedX = windowWidth - catImage.offsetWidth - initialX;
      if (translateY + initialY + catImage.offsetHeight > windowHeight) limitedY = windowHeight - catImage.offsetHeight - initialY;
    
      return `translate(${limitedX}px, ${limitedY}px)`;
    }
    
    // 初期位置を取得
    initialX = catImage.offsetLeft;
    initialY = catImage.offsetTop;
    
    // 画像を左端から動かす
    var keyframes = [
      { transform: getLimitedTransform('translate(0px, 0px)'), offset: 0 },
      { transform: getLimitedTransform('translate(100px, -100px)'), offset: 0.05 },
      { transform: getLimitedTransform('translate(100px, -100px)'), offset: 0.1 },
      { transform: getLimitedTransform('translate(0px, -200px)'), offset: 0.2 },
      { transform: getLimitedTransform('translate(0px, -200px)'), offset: 0.25 },
      { transform: getLimitedTransform('translate(-200px, 0px)'), offset: 0.35 },
      { transform: getLimitedTransform('translate(-200px, 0px)'), offset: 0.4 },
      { transform: getLimitedTransform('translate(0px, 200px)'), offset: 0.5 },
      { transform: getLimitedTransform('translate(0px, 200px)'), offset: 0.55 },
      { transform: getLimitedTransform('translate(100px, 100px)'), offset: 0.65 },
      { transform: getLimitedTransform('translate(100px, 100px)'), offset: 0.75 },
      { transform: getLimitedTransform('translate(0px, 0px)'), offset: 0.8 }
    ];
    
    catImage.animate(
      keyframes,
      {
        fill: 'forwards',
        duration: 30000,
        iterations: Infinity,
      }
    );
    
    catImage.addEventListener('touchstart', touchStartHandler);
    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', touchEndHandler);
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  await displayCatsFromLastFourDays();
  movePicture();
});