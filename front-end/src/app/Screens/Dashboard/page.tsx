'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import CategoriesDonut from '@/components/CategoriesDonut';
import ParetoChart from '@/components/ParetoChart';
import RecentUpdates from '@/components/RecentUpdates';
import { api } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface LogMovimentacao {
  id: number;
  timestamp: string;
  event_description: string;
  user_id: number | null;
  user_name?: string;
}

interface KpiData {
  TotalInventario: number;
  EmTriagem: number;
  DoacoesAprovadas: number;
  DescartesRealizados: number;
  FilaTriagem: number;
  PecasFaltantes: number;
  ProcessadosTurno: string;
  AguardandoSanitizacao: number;
}

interface ParetoItem {
  defeito: string;
  quantidade: number;
}

interface AtualizacaoItem {
  titulo: string;
  subtitulo: string;
  tempo: string;
  icone: string;
}

interface FrequenciaItem {
  tipo: string;
  quantidade: number;
  porcentagem: number;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [pareto, setPareto] = useState<ParetoItem[]>([]);
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoItem[]>([]);
  const [frequencia, setFrequencia] = useState<FrequenciaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Log completo
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logs, setLogs] = useState<LogMovimentacao[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logStart, setLogStart] = useState('');
  const [logEnd, setLogEnd] = useState('');
  const [logMsg, setLogMsg] = useState<string | null>(null);
  const [logError, setLogError] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [kpisRes, paretoRes, atualizacoesRes, frequenciaRes] = await Promise.all([
        api.get<KpiData>('/dashboard/kpis'),
        api.get<ParetoItem[]>('/dashboard/pareto-defeitos'),
        api.get<AtualizacaoItem[]>('/dashboard/ultimas-atualizacoes'),
        api.get<FrequenciaItem[]>('/dashboard/frequencia-tipos'),
      ]);

      setKpis(kpisRes.data);

      const paretoList = Array.isArray(paretoRes.data) ? paretoRes.data : (paretoRes.data as any)?.itens ?? [];
      setPareto(paretoList);
      const atList = Array.isArray(atualizacoesRes.data) ? atualizacoesRes.data : (atualizacoesRes.data as any)?.itens ?? [];
      setAtualizacoes(atList);
      const freqList = Array.isArray(frequenciaRes.data) ? frequenciaRes.data : (frequenciaRes.data as any)?.itens ?? [];
      setFrequencia(freqList);
      setDataLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setKpis(null);
      setPareto([]);
      setAtualizacoes([]);
      setFrequencia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchLogs = async (start?: string, end?: string) => {
    setLogsLoading(true);
    setLogError(false);
    setLogMsg(null);
    try {
      const params: any = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      const res = await api.get<LogMovimentacao[]>('/dashboard/movimentacoes', { params });
      setLogs(res.data || []);
    } catch {
      setLogError(true);
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleOpenLogModal = async () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    const startDate = start.split('T')[0];
    const endDate = end.split('T')[0];
    setLogStart(startDate);
    setLogEnd(endDate);
    setLogModalOpen(true);
    await fetchLogs(startDate, endDate);
  };

  const handleExportarLogs = () => {
    if (!logStart || !logEnd) {
      setLogMsg('Selecione o período antes de exportar.');
      return;
    }
    const url = `/api/dashboard/movimentacoes/exportar?startDate=${encodeURIComponent(logStart)}&endDate=${encodeURIComponent(logEnd)}`;
    window.open(url, '_blank');
    setLogMsg('Exportação iniciada. Verifique seus downloads.');
  };

  return (
    <div className="bg-[#f3faff] text-[#071e27] min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <Sidebar
        userType="internal"
        userName={currentUserName}
        userRole={currentUserRole}
        userPhoto={currentUserPhoto}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header title="Dashboard Geral" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 pb-12">

          <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#071e27] tracking-tighter mb-2">Visão Geral</h3>
            </div>
            <button
              onClick={() => window.location.href = '/Screens/Inventario'}
              className="bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Registrar Equipamento
            </button>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="devices"
              label="Fila de triagem"
              value={loading ? '...' : (kpis?.FilaTriagem ?? 0)}
              sub="Equipamentos aguardando"
              iconBgClass="bg-[#d6e3ff] text-[#00468c]"
              hoverAccent={true}
            />
            <StatCard
              icon="pending_actions"
              label="Status de peças"
              value={loading ? '...' : (kpis?.PecasFaltantes ?? 0)}
              sub="Peças faltantes, reposição"
              iconBgClass="bg-[#92f1fe] text-[#004f56]"
              hoverAccent={true}
            />
            <StatCard
              icon="cached"
              label="Processados no turno"
              value={loading ? '...' : (kpis?.ProcessadosTurno ?? '0/0')}
              sub="4h restantes no turno"
              iconBgClass="bg-[#a3f69c] text-[#005312]"
              hoverAccent={true}
            />
            <StatCard
              icon="handshake"
              label="Sanitização de Dados"
              value={loading ? '...' : (kpis?.AguardandoSanitizacao ?? 0)}
              sub="Aguardando formatação segura"
              iconBgClass="bg-[#007984] text-white"
              hoverAccent={true}
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <ParetoChart
              data={pareto}
              dataLoaded={dataLoaded}
            />

            <RecentUpdates
              items={atualizacoes}
              onLogCompleto={handleOpenLogModal}
            />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {(() => {
              const donutSegments = frequencia.length > 0
                ? frequencia.map((f, i) => ({
                    label: f.tipo,
                    percent: Math.round(f.porcentagem),
                    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i] || '#64748b'
                  }))
                : [];
              return (
                <CategoriesDonut
                  segments={donutSegments}
                  total={kpis?.TotalInventario ?? 0}
                  title="Frequência de Tipos Cadastrados"
                />
              );
            })()}

            <div id="log1" className="w-full bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Dashboard</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">Log Completo de Movimentações</h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">
                    Histórico
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Acesse o histórico completo pelo botão abaixo</h4>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <div className="w-px h-full bg-gray-200 my-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-gray-700 font-bold">Dashboard inicializado</p>
                      <p className="text-xs text-gray-400 mt-1">Carregando dados reais...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => alert('Use o filtro de período no modal para gerar o documento CSV.')}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Exportar Relatório
                </button>
                <button
                  onClick={handleOpenLogModal}
                  className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                >
                  Log Completo
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Modal Log Completo */}
      {logModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="text-xl font-black text-[#071e27]">Log Completo de Movimentações</h3>
                <p className="text-xs text-gray-500 mt-0.5">Histórico de eventos do dia</p>
              </div>
              <button
                onClick={() => setLogModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Data Início</label>
                  <input
                    type="date"
                    value={logStart}
                    onChange={(e) => setLogStart(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Data Fim</label>
                  <input
                    type="date"
                    value={logEnd}
                    onChange={(e) => setLogEnd(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  onClick={() => fetchLogs(logStart, logEnd)}
                  className="px-5 py-2.5 text-sm font-bold border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Filtrar
                </button>
              </div>

              {logMsg && <p className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">{logMsg}</p>}

              {/* Lista de logs */}
              <div className="overflow-auto max-h-[50vh] border border-gray-100 rounded-2xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="text-left text-xs uppercase text-gray-500 font-bold tracking-wider">
                      <th className="py-3 px-4">Data/Hora</th>
                      <th className="py-3 px-4">Evento</th>
                      <th className="py-3 px-4">Usuário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsLoading ? (
                      <tr><td colSpan={3} className="text-center py-8 text-gray-500">Carregando logs...</td></tr>
                    ) : logError ? (
                      <tr><td colSpan={3} className="text-center py-8 text-red-500">Erro ao carregar logs.</td></tr>
                    ) : logs.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-8 text-gray-500">Nenhum log encontrado.</td></tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-gray-800">{log.event_description}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {log.user_name || `ID: ${log.user_id ?? '—'}`}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setLogModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={handleExportarLogs}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                Exportar Período CSV
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
