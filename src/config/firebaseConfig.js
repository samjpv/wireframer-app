import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAy_j8Ni4DpnjlaP9TAj6YCJ7xWZV2uzOs",
    authDomain: "wireframer-4a36b.firebaseapp.com",
    databaseURL: "https://wireframer-4a36b.firebaseio.com",
    projectId: "wireframer-4a36b",
    storageBucket: "wireframer-4a36b.appspot.com",
    messagingSenderId: "882506427393",
    appId: "1:882506427393:web:3742441b2c8d9ce3786400",
    measurementId: "G-Z8ECDV5CX0"
  };
  firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;
