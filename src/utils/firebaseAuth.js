import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredKeys = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId
];

export const isFirebaseConfigured = requiredKeys.every(Boolean);

const getFirebaseAuth = () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys to your environment.');
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getAuth(app);
};

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const authenticateWithEmailPassword = async ({ email, password, fullName, mode }) => {
  const auth = getFirebaseAuth();

  if (mode === 'signup') {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (fullName?.trim()) {
      await updateProfile(result.user, { displayName: fullName.trim() });
    }

    return result.user;
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const authenticateWithGoogle = async () => {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const resetPasswordForEmail = async (email) => {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthState = (callback) => {
  if (!isFirebaseConfigured) {
    return () => {};
  }

  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

export const signOutUser = async () => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};

export const getFirebaseErrorMessage = (error) => {
  const errorCode = error?.code || '';

  if (errorCode === 'auth/invalid-email') return 'Please enter a valid email address.';
  if (errorCode === 'auth/user-not-found') return 'No account found for this email.';
  if (errorCode === 'auth/wrong-password') return 'Incorrect password. Please try again.';
  if (errorCode === 'auth/email-already-in-use') return 'An account with this email already exists.';
  if (errorCode === 'auth/weak-password') return 'Password should be at least 6 characters.';
  if (errorCode === 'auth/popup-closed-by-user') return 'Google sign-in was cancelled.';
  if (errorCode === 'auth/too-many-requests') return 'Too many attempts. Please wait and try again.';

  return error?.message || 'Authentication failed. Please try again.';
};
