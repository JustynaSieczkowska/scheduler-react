import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDdSao1EqjWMc8d2PG7CkPHX8F9hvaBcNM",
  authDomain: "calender-8ed53.firebaseapp.com",
  projectId: "calender-8ed53",
  storageBucket: "calender-8ed53.appspot.com",
  messagingSenderId: "573815066246",
  appId: "1:573815066246:web:6deef8664c1ee6416f4b07",
  measurementId: "G-J0FBMR82YY"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };