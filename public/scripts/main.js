// Import the functions you need from the SDKs you need
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

const auth = getAuth();

signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

// Firebaseの設定
// const firebaseConfig = {
//   apiKey: "AIzaSyBLZxPyi_FRQxzyWp5GJlxOXuvAOnb4Jl0",
//   authDomain: "react-sample-app-fd3e4.firebaseapp.com",
//   projectId: "react-sample-app-fd3e4",
//   storageBucket: "react-sample-app-fd3e4.appspot.com",
//   messagingSenderId: "143405994379",
//   appId: "1:143405994379:web:cebd1410e5b8ed10b21f8e",
//   measurementId: "G-GMN8V3TLQT",
// };
