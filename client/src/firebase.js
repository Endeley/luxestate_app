// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'luxestate-50ac3.firebaseapp.com',
    projectId: 'luxestate-50ac3',
    storageBucket: 'luxestate-50ac3.appspot.com',
    messagingSenderId: '240968816638',
    appId: '1:240968816638:web:f4e1ac9ffcf78a650f52af',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
