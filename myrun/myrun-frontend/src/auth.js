// src/auth.js

const STORAGE_KEY = "myrunAuth";

// { token, user } 형태로 저장
export function getAuth() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken() {
  const auth = getAuth();
  return auth?.token || null;
}

export function getCurrentUser() {
  const auth = getAuth();
  return auth?.user || null;
}

export function setAuth(auth) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
