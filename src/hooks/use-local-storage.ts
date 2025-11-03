"use client";

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // We need to use a useEffect to read from localStorage.
  // This ensures that the code only runs on the client, after the initial server render.
  useEffect(() => {
    // This check is still good practice.
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      // When the component mounts on the client, we update the state with the value from localStorage.
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.log(error);
      setStoredValue(initialValue);
    }
  // We only want this to run once on mount, so we pass an empty dependency array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
