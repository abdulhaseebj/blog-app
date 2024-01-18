import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUZDIzQkzSrYRWmpzKmoLW7qkkXI38LNM",
    authDomain: "blogging-app-11.firebaseapp.com",
    projectId: "blogging-app-11",
    storageBucket: "blogging-app-11.appspot.com",
    messagingSenderId: "695573962951",
    appId: "1:695573962951:web:4fd69056a608830b235ee2"
  };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
