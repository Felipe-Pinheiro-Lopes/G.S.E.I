// src/services/api.ts
import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5145/api',
});

let authConfigured = false;
const ensureAuth = () => {
  if (typeof window === 'undefined' || authConfigured) return;
  const cookies = parseCookies();
  if (cookies['gesi.token']) {
    api.defaults.headers['Authorization'] = `Bearer ${cookies['gesi.token']}`;
  }
  authConfigured = true;
};

export const resolver = async <T>(request: Promise<{ data: T }>, fallback?: T): Promise<T> => {
  try {
    const { data } = await request;
    return (data as T);
  } catch {
    return (fallback as T) ?? ({} as T);
  }
};

export const listFromResponse = <T>(raw: any, fallback: T[] = []): T[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.itens)) return raw.itens;
  return fallback;
};