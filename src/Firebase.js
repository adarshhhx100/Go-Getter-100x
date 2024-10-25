// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAVRSJnjN9GzQh_UBMgfTQl3dMNkWf4nP4",
    authDomain: "go100x.firebaseapp.com",
    projectId: "go100x",
    storageBucket: "go100x.appspot.com",
    messagingSenderId: "756334068362",
    appId: "1:756334068362:web:89f3cc52626fce3885a373",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
