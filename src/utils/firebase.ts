import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVZyA2whyx3Lw-4vknsAXI7Beu2fvMYFA",
    authDomain: "ticket-e3dbc.firebaseapp.com",
    projectId: "ticket-e3dbc",
    storageBucket: "ticket-e3dbc.firebasestorage.app",
    messagingSenderId: "472998624094",
    appId: "1:472998624094:web:bf0a94cf1ca2aaed59edcf"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };