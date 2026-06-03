'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function SolicitacaoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="bg-[#f3faff] text-[#071e27] min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <Sidebar userType="institution" userName="Assoc. Filantrópica" userRole="ID: 98231" />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          title="Solicitar Doação" 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-12">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Nova Requisição de Equipamentos</h2>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados e selecione os itens disponíveis no estoque de doação.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-700">business</span>
                  Dados da Instituição
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Responsável pela Retirada</label>
                    <input type="text" required placeholder="Nome completo" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Telefone de Contato</label>
                    <input type="tel" required placeholder="(00) 00000-0000" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Finalidade da Doação</label>
                    <textarea rows={3} required placeholder="Ex: Montagem de laboratório de informática para crianças..." className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-green-600 outline-none transition text-sm resize-none" />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[11px] text-blue-800 font-bold leading-relaxed">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                      Ao finalizar, sua solicitação passará por triagem técnica antes da liberação para retirada.
                    </p>
                  </div>
                  <button type="submit" className="w-full bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2">
                    Enviar Solicitação
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-white">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-700">inventory_2</span>
                    Itens Disponíveis para Doação
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Selecione os equipamentos que deseja solicitar.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Item / Modelo</th>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Lote</th>
                        <th className="px-6 py-4">Disponível</th>
                        <th className="px-6 py-4 text-center">Selecionar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: 'Notebook Lenovo ThinkPad', spec: 'I5 8GB / SSD 240GB', id: '#DOA-8821', lote: 'L-2024-EX', qty: '12 UNID.' },
                        { name: 'Monitor Dell 21" P2219H', spec: 'Full HD / Ajuste Altura', id: '#DOA-5540', lote: 'L-2024-EX', qty: '08 UNID.' }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-green-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-[11px] text-gray-500">{item.spec}</p>
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-500">{item.id}</td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{item.lote}</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-bold text-[11px]">{item.qty}</span></td>
                          <td className="px-6 py-4 text-center"><input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-600 cursor-pointer" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Solicitação Enviada!</h2>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">Sua solicitação de doação foi registrada no sistema G.S.E.I. sob o número <span className="text-blue-600 font-bold">#SOL-2024-041</span>.</p>
            <div className="flex flex-col gap-3">
              <a href="/Screens/AcompanhamentoSolicitacao" className="w-full py-4 bg-green-800 text-white rounded-2xl font-bold text-sm hover:bg-green-900 transition">Acompanhar Situação</a>
              <button onClick={() => setShowModal(false)} className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition">Fazer outra solicitação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
