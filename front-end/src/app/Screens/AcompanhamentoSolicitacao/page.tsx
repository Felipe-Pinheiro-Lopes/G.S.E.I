'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { api, listFromResponse } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Solicitacao {
  id: number;
  instituicaoNome: string;
  responsavelRetirada: string;
  status: string;
  dataSolicitacao: string;
  protocolo: string;
  prioridade: string;
}

export default function AcompanhamentoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const res = await api.get('/Solicitacoes');
        const lista = listFromResponse<any>(res.data).map((s: any) => ({
          id: s.id,
          instituicaoNome: s.instituicaoNome || 'Instituição',
          responsavelRetirada: s.responsavelRetirada || '',
          status: s.status,
          dataSolicitacao: s.dataSolicitacao,
          protocolo: s.protocolo || '',
          prioridade: s.prioridade || 'Média',
        }));
        setSolicitacoes(lista);
      } catch (e) {
        console.error('Erro ao carregar solicitações:', e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitacoes();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return 'bg-green-100 text-green-700';
      case 'Negada':
        return 'bg-red-100 text-red-700';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      case 'AguardandoInfo':
        return 'bg-blue-100 text-blue-700';
      case 'Em Análise':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AguardandoInfo': return 'Aguardando Informações';
      case 'Aprovada': return 'Aprovada';
      case 'Negada': return 'Negada';
      case 'Pendente': return 'Pendente';
      case 'Em Análise': return 'Em Análise';
      default: return status;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-50 text-red-600 border-red-200';
      case 'Média': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Baixa': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-[#f3faff] min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <Sidebar
        userType="institution"
        userName={currentUserName}
        userRole={currentUserRole}
        userPhoto={currentUserPhoto}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header title="Minhas Solicitações" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#071e27] tracking-tight">Acompanhamento de Solicitações</h2>
            <p className="text-sm text-gray-600 mt-1">Visualize o status das suas requisições de doação de equipamentos.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando solicitações...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">Erro ao carregar dados. Verifique a conexão com o servidor.</div>
            ) : solicitacoes.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">inbox</span>
                <p className="text-gray-500 text-lg font-bold">Nenhuma solicitação encontrada</p>
                <p className="text-gray-400 text-sm mt-1">Suas solicitações de doação aparecerão aqui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 font-bold uppercase tracking-widest text-xs">
                      <th className="py-3 px-4">Protocolo</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Responsável</th>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4 hidden md:table-cell">Prioridade</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoes.map((sol) => (
                      <tr key={sol.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-mono text-sm text-blue-700 font-bold">{sol.protocolo}</td>
                        <td className="py-4 px-4 text-gray-800 font-medium hidden sm:table-cell">{sol.responsavelRetirada}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(sol.dataSolicitacao).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getPrioridadeBadge(sol.prioridade)}`}>
                            {sol.prioridade}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(sol.status)}`}>
                            {getStatusLabel(sol.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
