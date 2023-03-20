// Import the functions you need from the SDKs you need
import { initializeApp } from "@react-native-firebase/app";
import { getAnalytics } from "@react-native-firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOWnBCSHjMGCGF1EUycGntildV844uUSM",
  authDomain: "hygp2-ec607.firebaseapp.com",
  projectId: "hygp2-ec607",
  storageBucket: "hygp2-ec607.appspot.com",
  messagingSenderId: "603930050293",
  appId: "1:603930050293:web:4acfa6e947d76587bacfbc",
  measurementId: "G-YV0BZHL37W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);