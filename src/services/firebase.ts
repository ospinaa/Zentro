<<<<<<< HEAD

=======
>>>>>>> a26aa50691b5e80f70ab39b91744990bcbc72a30

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyAZeuYitnUMX-rSNv0fJ1Ac8TvTkI2ko-s",
  authDomain: "zentro-app-f8dbc.firebaseapp.com",
  projectId: "zentro-app-f8dbc",
  storageBucket: "zentro-app-f8dbc.firebasestorage.app",
  messagingSenderId: "1018205128098",
  appId: "1:1018205128098:web:6436754d8eefdfa12a5efb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);