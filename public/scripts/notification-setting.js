// scripts/notification-setting.js

document.addEventListener('DOMContentLoaded', function () {
  // flatpickr を start-time と end-time に適用
  document.querySelectorAll('.start-time, .end-time').forEach(function (timeElement) {
    flatpickr(timeElement, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true
    });
  });

  // dayをクリックで選択状態にする
  document.querySelectorAll('.day').forEach(function (dayElement) {
    dayElement.addEventListener('click', function () {
      dayElement.classList.toggle('selected');
    });
  });
});
