importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAlTePWwrT-trMvaaNShV7lRQl7tQmMM68",
    authDomain: "to-shop-application-db.firebaseapp.com",
    projectId: "to-shop-application-db",
    storageBucket: "to-shop-application-db.appspot.com",
    messagingSenderId: "172135165954",
    appId: "1:172135165954:web:e42c1a3a6f229a742bb71b"
});
    
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});