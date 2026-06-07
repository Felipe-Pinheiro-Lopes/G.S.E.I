// src/services/api.ts
import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5145/api',
});

// Axios request interceptor: attach JWT token from cookie on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const cookies = parseCookies();
    const token = cookies['gesi.token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

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