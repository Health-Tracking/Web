// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Firebase Auth 및 GoogleAuthProvider 추가
import { getFirestore } from "firebase/firestore"; // Firestore import
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLfeqv9IaAH8-40_KiIWCEf0cYGXaq2d4",
    authDomain: "health-tracking-cc765.firebaseapp.com",
    projectId: "health-tracking-cc765",
    storageBucket: "health-tracking-cc765.appspot.com",
    messagingSenderId: "427207502356",
    appId: "1:427207502356:web:7a884ddfd49595eca9d501",
    measurementId: "G-64H0CX7YPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Firebase Auth 초기화
const googleProvider = new GoogleAuthProvider(); // GoogleAuthProvider 초기화

// 계정 선택 팝업을 항상 표시하도록 설정
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

const db = getFirestore(app); // Firestore 초기화

export { app, analytics, auth, googleProvider, db }; // db 추가