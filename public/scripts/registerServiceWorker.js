if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/serviceWorker.min.js");
      // console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);

      // Periodic Background Sync登録
      if ('periodicSync' in registration) {
        try {
          await registration.periodicSync.register('send-notification', {
            minInterval: 24 * 60 * 60 * 1000, // 24時間
          });
          // console.log('Periodic Sync registered');
        } catch (error) {
          // console.error('Periodic Sync registration failed:', error);
        }
      }
    } catch (error) {
      console.error(`ServiceWorker registration failed: ${error}`);
    }
  });
}
