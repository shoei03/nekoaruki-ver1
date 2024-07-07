// scripts/notification-setting.js

// dayをクリックで選択状態にする
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.day').forEach(function (dayElement) {
    dayElement.addEventListener('click', function () {
      dayElement.classList.toggle('selected');
    });
  });
});
