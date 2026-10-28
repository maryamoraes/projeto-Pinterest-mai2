import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEn37OBpJMmQrxiTY-zygJ8T6NiLGsT8g",
  authDomain: "aula-mobile-ienh-c415d.firebaseapp.com",
  projectId: "aula-mobile-ienh-c415d",
  storageBucket: "aula-mobile-ienh-c415d.firebasestorage.app",
  messagingSenderId: "905572951263",
  appId: "1:905572951263:web:f7208d88a101c1f2e4356a",
  measurementId: "G-5YQ0F4TZJ7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);