import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage';
// import * as firebase from 'firebase/app';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyAO8dwLhkfy31CDpsJhCYbasVfoteYS7ns',
  authDomain: 'linkedin-clone-2a6c2.firebaseapp.com',
  projectId: 'linkedin-clone-2a6c2',
  storageBucket: 'linkedin-clone-2a6c2.appspot.com',
  messagingSenderId: '900048304920',
  appId: '1:900048304920:web:bcfd40993e4e2caa6b3c6d',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export { auth, provider, storage, db };
