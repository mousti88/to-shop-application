import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlTePWwrT-trMvaaNShV7lRQl7tQmMM68",
    authDomain: "to-shop-application-db.firebaseapp.com",
    projectId: "to-shop-application-db",
    storageBucket: "to-shop-application-db.appspot.com",
    messagingSenderId: "172135165954",
    appId: "1:172135165954:web:e42c1a3a6f229a742bb71b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAlTePWwrT-trMvaaNShV7lRQl7tQmMM68",
//   authDomain: "to-shop-application-db.firebaseapp.com",
//   projectId: "to-shop-application-db",
//   storageBucket: "to-shop-application-db.appspot.com",
//   messagingSenderId: "172135165954",
//   appId: "1:172135165954:web:e42c1a3a6f229a742bb71b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);