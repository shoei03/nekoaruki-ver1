$(document).ready(() => {
  console.log("Ready!!");

  // ボタンイベント
  $("#my_btn").click(() => {
    console.log("Push");

    // 1. Permissionの確認
    if (!Push.Permission.has()) {
      // 2. Permissionのリクエスト
      Push.Permission.request(
        () => {
          console.log("onGranted!!");
          const status = Push.Permission.get(); // Status
        },
        () => {
          console.log("onDenied!!");
          const status = Push.Permission.get(); // Status
        }
      );
    } else {
      // 3. Notificationの実行
      Push.create("今すぐ歩かないと！！", {
        body: "散歩の時間です",
        icon: "https://www.kaigo-antenna.jp/uploads/illustration/main_image/789/202107_009_s.jpg",
        tag: "myTag",
        timeout: 12000,
        vibrate: [100, 100, 100],
        onClick: function (e) {
          console.log("onClick", e);
        },
        onShow: function (e) {
          console.log("onShow", e);
        },
        onClose: function (e) {
          console.log("onClose", e);
        },
        onError: function (e) {
          console.log("onError", e);
        },
      });
    }
  });
});
