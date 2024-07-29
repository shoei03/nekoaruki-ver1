document.addEventListener('DOMContentLoaded', async () => {

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const startCameraButton = document.getElementById('startCameraButton');
    
    startCameraButton.addEventListener('click', async () => {
        // カメラにアクセス
        console.log("カメラ接続");
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        } catch (err) {
        console.error('カメラへのアクセスが拒否されました:', err);
        }
    });
  
    
  
    // 写真を撮る
    takePhotoButton.addEventListener('click', () => {
        console.log("写真を撮る");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        photo.setAttribute('src', dataUrl);
  
      // ここでdataUrlを使用してサーバーに送信するなどの保存処理を追加できます。
    });
});

  