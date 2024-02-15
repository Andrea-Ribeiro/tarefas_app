import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyB2XKpYBUiHhj-Gl0YxI-Mk418UmUBqR54",
    authDomain: "cursoreact-4c471.firebaseapp.com",
    projectId: "cursoreact-4c471",
    storageBucket: "cursoreact-4c471.appspot.com",
    messagingSenderId: "380791673138",
    appId: "1:380791673138:web:9dc12fa559e77c244a072b",
    measurementId: "G-J56EZNRSDS"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth }; 