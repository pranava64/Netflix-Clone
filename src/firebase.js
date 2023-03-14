import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwjiuzFhWWNp6AEZ8TBKQ1S-tQOISwINk",
  authDomain: "netflix-clone-4a437.firebaseapp.com",
  projectId: "netflix-clone-4a437",
  storageBucket: "netflix-clone-4a437.appspot.com",
  messagingSenderId: "966758234032",
  appId: "1:966758234032:web:71b4259a5c403b540e4875",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};