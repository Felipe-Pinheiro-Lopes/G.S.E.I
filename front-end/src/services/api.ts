// src/services/api.ts
import axios from 'axios';
import { parseCookies } from 'nookies';

// Pegamos o token dos cookies (se houver) para requisições no Lado do Cliente
const cookies = parseCookies();

export const api = axios.create({
  // PEGAR O IP DA SUA INSTÂNCIA ORACLE CLOUD
  baseURL: 'http://localhost:5145/api',
});

// Adiciona o token automaticamente no cabeçalho de todas as requisições
if (cookies['gesi.token']) {
  api.defaults.headers['Authorization'] = `Bearer ${cookies['gesi.token']}`;
}