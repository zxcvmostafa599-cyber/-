import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const STORAGE_KEY_FIREBASE_CONFIG = 'supermarket_custom_firebase_config';

// Load stored config or environment variables
export function getActiveFirebaseConfig(): FirebaseClientConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading saved firebase config', e);
  }

  // Check Vite environment variables
  const env = (import.meta as any).env || {};
  if (env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: env.VITE_FIREBASE_APP_ID || '',
    };
  }

  // Default shared project credentials fallback
  return {
    apiKey: 'AIzaSyA8_SUPERMARKET_POS_DEFAULT_KEY',
    authDomain: 'supermarket-pos-shared.firebaseapp.com',
    projectId: 'supermarket-pos-shared',
    storageBucket: 'supermarket-pos-shared.appspot.com',
    messagingSenderId: '1029384756',
    appId: '1:1029384756:web:89a7bcd65ef3',
  };
}

export function saveCustomFirebaseConfig(config: FirebaseClientConfig): void {
  localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
  // Reload app to re-initialize Firebase instances cleanly
  window.location.reload();
}

export function clearCustomFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
  window.location.reload();
}

let appInstance: FirebaseApp;
let firestoreInstance: Firestore;
let authInstance: Auth;

export function initFirebase() {
  const config = getActiveFirebaseConfig() || {
    apiKey: 'AIzaSyA8_DEFAULT_POS_KEY',
    authDomain: 'supermarket-pos-shared.firebaseapp.com',
    projectId: 'supermarket-pos-shared',
    appId: '1:1029384756:web:89a7bcd65ef3',
  };

  try {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(config);
    }

    try {
      firestoreInstance = initializeFirestore(appInstance, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      firestoreInstance = getFirestore(appInstance);
    }

    authInstance = getAuth(appInstance);
  } catch (err) {
    console.error('Failed to initialize Firebase SDK:', err);
    // Create minimal fallback
    appInstance = initializeApp(config, 'fallback-' + Date.now());
    firestoreInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
  }

  return { app: appInstance, firestore: firestoreInstance, auth: authInstance };
}

const { app, firestore, auth } = initFirebase();

export { app, firestore as db, auth };
