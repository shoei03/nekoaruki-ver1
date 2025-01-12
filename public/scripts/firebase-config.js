import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCqL13yx8EtNrP6YHYafdv6lkNy-LWAKsc",
    authDomain: "nekoaruki-61e91.firebaseapp.com",
    projectId: "nekoaruki-61e91",
    storageBucket: "nekoaruki-61e91.firebasestorage.app",
    messagingSenderId: "609690482935",
    appId: "1:609690482935:web:5bd28f51db198ec8b33bf2",
    measurementId: "G-NNETH4DJ2N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);
const storage = getStorage(app);

export { db, auth, messaging, storage };
