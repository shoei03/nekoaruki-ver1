import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBLZxPyi_FRQxzyWp5GJlxOXuvAOnb4Jl0",
    authDomain: "react-sample-app-fd3e4.firebaseapp.com",
    projectId: "react-sample-app-fd3e4",
    storageBucket: "react-sample-app-fd3e4.appspot.com",
    messagingSenderId: "143405994379",
    appId: "1:143405994379:web:cebd1410e5b8ed10b21f8e",
    measurementId: "G-GMN8V3TLQT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);
const storage = getStorage(app);

export { db, auth, messaging, storage };
