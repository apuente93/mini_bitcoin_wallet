// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA5NzGSwROz-EqBY7kNX78Q0OBqwPdYeDs",
    authDomain: "authentication-28b51.firebaseapp.com",
    projectId: "authentication-28b51",
    storageBucket: "authentication-28b51.appspot.com",
    messagingSenderId: "883598174668",
    appId: "1:883598174668:web:f26ab1ed403e3a34b5d569",
    measurementId: "G-5NQ94170Y8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
