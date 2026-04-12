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

// Initialize Firestore and export it
const db = getFirestore(app);

// Log to confirm initialization
//console.log("Firebase initialized", app);
export { db , app};


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



// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAlTePWwrT-trMvaaNShV7lRQl7tQmMM68",
//   authDomain: "to-shop-application-db.firebaseapp.com",
//   projectId: "to-shop-application-db",
//   storageBucket: "to-shop-application-db.firebasestorage.app",
//   messagingSenderId: "172135165954",
//   appId: "1:172135165954:web:e42c1a3a6f229a742bb71b",
//   measurementId: "G-PKPF24X63S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);