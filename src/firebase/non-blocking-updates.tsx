'use client';
    
import {
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import {FirestorePermissionError} from '@/firebase/errors';

/**
 * Initiates a setDoc operation for a document reference.
 * If merge is true, it merges data; otherwise, it overwrites.
 * This is for creating or overwriting a document with a specific ID.
 * Does NOT await the write operation internally.
 */
export function setDocumentNonBlocking(docRef: DocumentReference, data: any, options: SetOptions = {}) {
  // Execution continues immediately
  return setDoc(docRef, data, options).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: docRef.path,
        operation: options.merge ? 'update' : 'create',
        requestResourceData: data,
      })
    )
  })
}


/**
 * Initiates an addDoc operation within a collection. This is for when Firestore should generate the ID.
 * This function can ONLY operate on a CollectionReference.
 * Does NOT await the write operation internally.
 * Returns the Promise for the new doc ref, but typically not awaited by caller.
 */
export function addDocumentToCollectionNonBlocking<T>(colRef: CollectionReference<T> , data: any) {
  const promise = addDoc(colRef, data);

  promise.catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      )
    });
  // Return the promise in case the caller wants to use the new doc ID, but they should handle the .then() themselves
  return promise;
}


/**
 * Initiates an updateDoc operation for a document reference.
 * This is the correct, safe way to update fields in an existing document.
 * Does NOT await the write operation internally.
 */
export function updateDocumentNonBlocking(docRef: DocumentReference, data: Partial<any>) {
  return updateDoc(docRef, data)
    .catch(error => {
      console.error("Update failed", error);
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data,
        })
      )
    });
}


/**
 * Initiates a deleteDoc operation for a document reference.
 * Does NOT await the write operation internally.
 */
export function deleteDocumentNonBlocking(docRef: DocumentReference) {
  return deleteDoc(docRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        })
      )
    });
}
