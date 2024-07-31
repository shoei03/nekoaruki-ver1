document.addEventListener('DOMContentLoaded', async () => {

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const startCameraButton = document.getElementById('startCameraButton');
    const picture = document.querySelector('.picture');
    
    // homeButton.textContent = 'ホームに戻る';
    // homeButton.classList.add('btn', 'btn-lg');
    // homeButton.style.display = 'none'; // 初期状態では非表示
    picture.innerHTML = "<button class='btn btn-lg' id='home-button' style='display: none;'>ホームに戻る</button>";
    const homeButton = document.getElementById('home-button');
    
    startCameraButton.addEventListener('click', async () => {
        // カメラにアクセス
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block'; // カメラプレビューを表示
            takePhotoButton.style.display = 'block'; // 写真を撮るボタンを表示
            startCameraButton.style.display = 'none'; // カメラを起動ボタンを非表示
            homeButton.style.display = 'block'; // ホームに戻るボタンを表示
        } catch (err) {
            console.error('カメラへのアクセスが拒否されました:', err);
        }
    });
  
    // 写真を撮る
    takePhotoButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        photo.setAttribute('src', dataUrl);
  
      // ここでdataUrlを使用してサーバーに送信するなどの保存処理を追加できます。
    });

    // ホームに戻るボタンのクリックイベント
    homeButton.addEventListener('click', () => {
        const stream = video.srcObject;
        const tracks = stream.getTracks();

        // 全てのトラックを停止
        tracks.forEach(track => track.stop());

        video.srcObject = null;
        video.style.display = 'none'; // カメラプレビューを非表示
        takePhotoButton.style.display = 'none'; // 写真を撮るボタンを非表示
        startCameraButton.style.display = 'block'; // カメラを起動ボタンを表示
        homeButton.style.display = 'none'; // ホームに戻るボタンを非表示
    });
});

  