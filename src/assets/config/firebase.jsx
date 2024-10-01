// Import the necessary functions from Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCH4Ox-RenIDjZtq0Uv3OOk_ovU4RSWLZc",
  authDomain: "t-hub-2cab2.firebaseapp.com",
  projectId: "t-hub-2cab2",
  storageBucket: "t-hub-2cab2.appspot.com",
  messagingSenderId: "52428034883",
  appId: "1:52428034883:web:4247d83fb67e80ee4cd5f6",
  measurementId: "G-JPXV9YHSFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Auth service and Firestore service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
