"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ib-deletion-password";

function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, b => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[b % 62]).join("");
}

export function useDefaultPassword(): [string, (val: string) => void] {
  const [password, setPasswordState] = useState("");

  useEffect(() => {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      saved = generatePassword();
      localStorage.setItem(STORAGE_KEY, saved);
    }
    setPasswordState(saved);
  }, []);

  const setPassword = useCallback((val: string) => {
    setPasswordState(val);
    localStorage.setItem(STORAGE_KEY, val);
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setPasswordState(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return [password, setPassword];
}
