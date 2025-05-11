import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAD_IPJFIw0yyzvzsB8gIPBag9sWg2ecD4",
  authDomain: "ta-fit5021.firebaseapp.com",
  projectId: "ta-fit5021",
  storageBucket: "ta-fit5021.firebasestorage.app",
  messagingSenderId: "190006848554",
  appId: "1:190006848554:web:13689b254f54f0ba242753",
  measurementId: "G-NK14F3TH3S",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get auth instance
const auth = getAuth(app);

// Set auth to session-based persistence
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Firebase auth set to session persistence.");
  })
  .catch((error) => {
    console.error("Error setting Firebase persistence:", error);
  });

// Export auth
export { auth };
