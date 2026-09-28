importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyD7-DQpZHBvGPwSj5xN-LTPIhI2q_689pE",
  authDomain: "axion-cyber.firebaseapp.com",
  projectId: "axion-cyber",
  storageBucket: "axion-cyber.firebasestorage.app",
  messagingSenderId: "795025324804",
  appId: "1:795025324804:web:f0fa23f874c7705087ae51"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || "Axion Cyber";
  const options = {
    body: notification.body || "You have a new security alert.",
    icon: "/icon.png",
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});
