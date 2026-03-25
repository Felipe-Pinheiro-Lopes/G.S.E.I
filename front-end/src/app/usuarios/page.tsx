// src/app/usuarios/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies, destroyCookie } from 'nookies';
import { api } from '@/src/services/api';

// Define o tipo de dados que esperamos da API
interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nomeAdmin, setNomeAdmin] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificação de Autenticação no Lado do Cliente
    const cookies = parseCookies();
    const token = cookies['gesi.token'];
    const userName = cookies['gesi.userName'];

    if (!token) {
      // Se não tem token, manda de volta pro login
      router.push('/login');
      return;
    }

    setNomeAdmin(userName || 'Administrador');

    // 2. Busca os dados da API
    async function carregarUsuarios() {
      try {
        // O Axios já está configurado para enviar o token no cabeçalho
        const response = await api.get('/User/listar');
        setUsuarios(response.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Se o token expirou ou usuário não é Admin (403 Forbidden)
          setErro('Você não tem permissão para acessar esta página ou sua sessão expirou.');
          // Opcional: deslogar o usuário
          // fazerLogout(); 
        } else {
          setErro('Falha ao carregar a lista de usuários.');
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, [router]);

  function fazerLogout() {
    destroyCookie(undefined, 'gesi.token', { path: '/' });
    destroyCookie(undefined, 'gesi.userName', { path: '/' });
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Simples */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">G.S.E.I - Painel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Olá, {nomeAdmin}</span>
            <button 
              onClick={fazerLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Gestão de Usuários</h2>
          <button className="bg-green-700 hover:bg-green-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Novo Usuário
          </button>
        </div>

        {carregando && (
          <div className="text-center text-gray-600 py-10">Carregando usuários...</div>
        )}

        {erro && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 font-medium mb-6">
            ⚠️ {erro}
          </div>
        )}

        {!carregando && !erro && usuarios.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-gray-500 border border-gray-100">
            Nenhum usuário cadastrado no sistema.
          </div>
        )}

        {/* Tabela de Usuários */}
        {!carregando && !erro && usuarios.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-5 font-medium text-gray-900">{user.nome}</td>
                    <td className="px-6 py-5 text-gray-700">{user.email}</td>
                    <td className="px-6 py-5 text-gray-700">{user.telefone || '-'}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'Admin' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      <button className="text-sm text-green-600 font-bold hover:text-green-800">Editar</button>
                      <button className="text-sm text-red-600 font-bold hover:text-red-800">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}