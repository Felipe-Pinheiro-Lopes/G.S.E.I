'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-[#f3faff] text-[#071e27] min-h-screen flex flex-col">
      <header className="w-full bg-white/80 backdrop-blur flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="font-black text-xl text-green-800">G.S.E.I.</h2>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Portal de Acesso</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Seja bem-vindo ao G.S.E.I.</h1>
            <p className="text-gray-500 mt-2 font-medium">Selecione o seu perfil para acessar a plataforma</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Employee Login */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-3xl">badge</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Funcionários</h2>
                  <p className="text-sm text-gray-500 font-medium">Acesso administrativo e técnico</p>
                </div>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">E-mail Corporativo ou Registro</label>
                  <input type="email" placeholder="marcus.chen@gsei.com" className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Senha</label>
                  <input type="password" placeholder="••••••••" className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" />
                </div>
                <Link href="/Screens/Dashboard" className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm text-center hover:bg-blue-700 transition">
                  Entrar como Funcionário
                </Link>
              </form>
            </div>

            {/* Institution Login */}
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Instituições</h2>
                  <p className="text-sm text-gray-500 font-medium">Portal para solicitar doações</p>
                </div>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">CNPJ ou ID da Instituição</label>
                  <input type="text" placeholder="12.345.678/0001-90" className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition-all text-sm font-medium" />
                </div>
                <Link href="/Screens/Solicitacao" className="block w-full py-4 bg-green-800 text-white rounded-2xl font-black text-sm text-center hover:bg-green-900 transition">
                  Entrar como Instituição
                </Link>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
