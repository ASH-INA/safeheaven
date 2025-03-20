
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 

const firebaseConfig = {
  apiKey: 'key',
  authDomain: 'safeheaven-a514a.firebaseapp.com',
  projectId: 'safeheaven-a514a',
  storageBucket: 'safeheaven-a514a.appspot.com',
  messagingSenderId: '1076640523551',
  appId: '1:1076640523551:android:a1d3b006fb345f2ff1fc2a'
};

const app = initializeApp(firebaseConfig);

// Export the Firebase services you need

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const firestore = getFirestore(app);
