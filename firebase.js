// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/compat';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATwb-rJna1__LRQxhjfN47D8D3eBPWM0A",
  authDomain: "ex4-firebase-c3d64.firebaseapp.com",
  databaseURL: "https://ex4-firebase-c3d64-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ex4-firebase-c3d64",
  storageBucket: "ex4-firebase-c3d64.appspot.com",
  messagingSenderId: "26253715398",
  appId: "1:26253715398:web:ee3efa8e638345d842f4c7"
};

let firebaseApp;

if(!firebase.apps.length){
    firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app()
}

//const auth = getAuth(firebaseApp);

export default firebaseApp;