// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_fMMKM-3ncayvdGvMRi226et1VAX1CtQ",
  authDomain: "social-media-567c8.firebaseapp.com",
  projectId: "social-media-567c8",
  storageBucket: "social-media-567c8.appspot.com",
  messagingSenderId: "557238987567",
  appId: "1:557238987567:web:a6c9b1be38a75be08f8fda",
  measurementId: "G-T3XHLNZQ3Q",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
