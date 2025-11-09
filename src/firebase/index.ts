'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    // If already initialized, return the SDKs with the already initialized App
    return getSdks(getApp());
  }

  let firebaseApp;

  // Use explicit config for development to ensure connectivity
  if (process.env.NODE_ENV !== 'production') {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // For production, try App Hosting's automatic initialization first
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      firebaseApp = initializeApp(firebaseConfig);
    }
  }
  
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';