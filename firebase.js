import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxvwV1WYjVss4mljAigfsWUORlwYeKolg",
  authDomain: "wisibl-marketing.firebaseapp.com",
  projectId: "wisibl-marketing",
  storageBucket: "wisibl-marketing.appspot.com",
  messagingSenderId: "968472931402",
  appId: "1:968472931402:web:568981adb872086b384ab3",
  measurementId: "G-TDM2JGP19S",
};

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
