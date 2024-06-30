// scripts/auth.js

// FirebaseUI の設定
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      console.log(authResult.user);
      return false;
    },
    uiShown: function () {
      document.getElementById("loader").style.display = "none";
    },
  },
  signInFlow: "redirect", // "popup" から "redirect" へ変更
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  tosUrl: "https://shoei03.github.io/policy/index.html",
  privacyPolicyUrl: "https://shoei03.github.io/policy/index.html",
};

// FirebaseUI の初期化
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#firebaseui-auth-container", uiConfig);

// 認証状態の監視
firebase.auth().onAuthStateChanged(function(user) {
  const authButton = document.getElementById('auth-button');
  if (authButton) {
    if (user) {
      authButton.textContent = 'ログアウト';
      authButton.onclick = function() {
        firebase.auth().signOut().then(() => {
          console.log('User signed out.');
        }).catch((error) => {
          console.error('Sign Out Error', error);
        });
      };
    } else {
      authButton.textContent = 'ログイン';
      authButton.onclick = function() {
        ui.start('#firebaseui-auth-container', uiConfig);
      };
    }
  } else {
    console.error('auth-button element not found');
  }
});
