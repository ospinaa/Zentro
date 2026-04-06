// src/services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 👈 IMPORTANTE

const firebaseConfig = {
  apiKey: "AIzaSyAZeuYitnUMX-rSNv0fJ1Ac8TvTkI2ko-s",
  authDomain: "zentro-app-f8dbc.firebaseapp.com",
  projectId: "zentro-app-f8dbc",
  storageBucket: "zentro-app-f8dbc.firebasestorage.app",
  messagingSenderId: "1018205128098",
  appId: "1:1018205128098:web:6436754d8eefdfa12a5efb"
};

const app = initializeApp(firebaseConfig);

// 👇 exportamos auth
export const auth = getAuth(app);