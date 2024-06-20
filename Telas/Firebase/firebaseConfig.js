// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDWSmEHeF99KbkC3HfguxsBHFZ06PMgE4k",
  authDomain: "fir-skyee.firebaseapp.com",
  projectId: "fir-skyee",
  storageBucket: "fir-skyee.appspot.com",
  messagingSenderId: "106869654108",
  appId: "1:106869654108:web:246a4c6996d9376f4a1c99"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
