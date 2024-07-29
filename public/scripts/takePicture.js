(async function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const photo = document.getElementById('photo');
    const takePhotoButton = document.getElementById('takePhotoButton');
  
    // カメラにアクセス
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error('カメラへのアクセスが拒否されました:', err);
    }
  
    // 写真を撮る
    takePhotoButton.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      photo.setAttribute('src', dataUrl);
  
      // ここでdataUrlを使用してサーバーに送信するなどの保存処理を追加できます。
    });
  })();
  