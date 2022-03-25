import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

firebase.initializeApp({
  apiKey: "AIzaSyDUVjHHltBrNc4i9UcSbkS9F4kuOp9GIYo",
  authDomain: "comments-section-ccef3.firebaseapp.com",
  projectId: "comments-section-ccef3",
  storageBucket: "comments-section-ccef3.appspot.com",
  messagingSenderId: "352784704241",
  appId: "1:352784704241:web:8d85273c2ca1a467adff50",
  measurementId: "G-SWYX3KY28E",
});

export default firebase.auth();
export const firestore = firebase.firestore();
export const createdTime = firebase.firestore.FieldValue.serverTimestamp();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
