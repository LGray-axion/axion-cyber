import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD7-DQpZHBvGPwSj5xN-LTPIhI2q_689pE",
  authDomain: "axion-cyber.firebaseapp.com",
  projectId: "axion-cyber",
  storageBucket: "axion-cyber.firebasestorage.app",
  messagingSenderId: "795025324804",
  appId: "1:795025324804:web:f0fa23f874c7705087ae51",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined" || !(await isSupported())) return null;
  return getMessaging(getFirebaseApp());
}
