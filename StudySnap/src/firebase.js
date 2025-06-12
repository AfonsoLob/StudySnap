import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBNio6Ge_IasoRKv1mOFJpfxbycITIm74k",
    authDomain: "studysnap-80b93.firebaseapp.com",
    projectId: "studysnap-80b93",
    storageBucket: "studysnap-80b93.firebasestorage.app",
    messagingSenderId: "852353269111",
    appId: "1:852353269111:web:f06bce810c9f2405c5f572",
    measurementId: "G-3FSZVHPR2M"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
