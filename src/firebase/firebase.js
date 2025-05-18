import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBH8DOl_i1glwP7qMbh9G2A9CHmiXjRQuQ",
  authDomain: "thinkplayact.firebaseapp.com",
  projectId: "thinkplayact",
  storageBucket: "thinkplayact.appspot.com",
  messagingSenderId: "837897055283",
  appId: "1:837897055283:web:3e732c10f0450fba120746",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
