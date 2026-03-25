// src/app/login/page.tsx
'use client' // Necessário para usar hooks como useState

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { api } from '@/src/services/api';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function fazerLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Chama o endpoint de login que configuramos no Back
      const response = await api.post('/User/login', {
        email,
        senha
      });

      const { token, user } = response.data;

      // Salva o Token e o Nome nos Cookies por 1 hora (3600 seg)
      setCookie(undefined, 'gesi.token', token, { maxAge: 3600, path: '/' });
      setCookie(undefined, 'gesi.userName', user, { maxAge: 3600, path: '/' });

      // Configura o Axios para usar o novo token nas próximas chamadas
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      // Redireciona para a tela de dashboard/usuários
      router.push('/usuarios');

    } catch (err: any) {
      console.error(err);
      setErro(err.response?.data?.message || 'Falha na conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Header do Portal */}
      <div className="flex flex-col items-center mb-8">
        {/* Substitua pelo ícone da imagem se tiver */}
        <div className="bg-green-700 p-4 rounded-xl mb-3">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <h1 className="text-xl font-bold text-green-800 tracking-wider">PORTAL INSTITUCIONAL</h1>
      </div>

      {/* Card de Login */}
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Acesso ao Sistema</h2>
        <p className="text-gray-600 mb-8">Insira suas credenciais para acessar o painel administrativo.</p>

        <form onSubmit={fazerLogin} className="space-y-6">
          {erro && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 text-sm font-medium">
              {erro}
            </div>
          )}

          {/* Campo E-mail */}
          <div>
            <label className="block text-sm font-bold text-green-700 mb-1 tracking-wide">E-MAIL CORPORATIVO</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="nome@instituicao.gov.br"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition text-gray-900"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-green-700 tracking-wide">SENHA DE ACESSO</label>
              <a href="#" className="text-sm text-green-600 font-medium hover:text-green-700">Recuperar senha</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-6V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input 
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                placeholder="********"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-200 focus:border-green-400 outline-none transition text-gray-900"
              />
            </div>
          </div>

          {/* Manter sessão */}
          <div className="flex items-center">
            <input type="checkbox" id="mantem" className="w-5 h-5 border-gray-300 rounded text-green-600 focus:ring-green-500" />
            <label htmlFor="mantem" className="ml-3 text-gray-700 font-medium">Manter sessão ativa</label>
          </div>

          {/* Botão Entrar */}
          <button 
            type="submit"
            disabled={carregando}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregando ? 'PROCESSANDO...' : 'ENTRAR NO SISTEMA'}
            {!carregando && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          Suporte técnico? <a href="#" className="text-green-600 font-bold hover:underline">Clique aqui</a>
        </div>
      </div>

      {/* Footer Barra */}
      <div className="mt-8 flex gap-6 text-xs text-gray-500 font-medium uppercase tracking-wider">
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> AMBIENTE SEGURO</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> AUDITADO V4.2</div>
      </div>
    </main>
  );
}