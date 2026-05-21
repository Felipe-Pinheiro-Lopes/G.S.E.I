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
import { useRouter } from 'next/navigation';


interface KpiData {
  totalInventario: number;
  emTriagem: number;
  doacoesAprovadas: number;
  descartesRealizados: number;
  filaTriagem: number;
  pecasFaltantes: number;
  processadosTurno: string;
  aguardandoSanitizacao: number;
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [pareto, setPareto] = useState<ParetoItem[]>([]);
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoItem[]>([]);
  const [frequencia, setFrequencia] = useState<FrequenciaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpisRes, paretoRes, atualizacoesRes, frequenciaRes] = await Promise.all([
          api.get<KpiData>('/dashboard/kpis'),
          api.get<ParetoItem[]>('/dashboard/pareto-defeitos'),
          api.get<AtualizacaoItem[]>('/dashboard/ultimas-atualizacoes'),
          api.get<FrequenciaItem[]>('/dashboard/frequencia-tipos'),
        ]);

        setKpis(kpisRes.data);
        setPareto(paretoRes.data);
        setAtualizacoes(atualizacoesRes.data);
        setFrequencia(frequenciaRes.data);
        setDataLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Fallback com dados de exemplo caso o backend esteja offline
        setKpis({
          totalInventario: 1284,
          emTriagem: 47,
          doacoesAprovadas: 312,
          descartesRealizados: 89,
          filaTriagem: 48,
          pecasFaltantes: 142,
          processadosTurno: "18/25",
          aguardandoSanitizacao: 156,
        });
        setPareto([
          { defeito: "Bateria Viciada", quantidade: 892 },
          { defeito: "Tela Quebrada", quantidade: 156 },
          { defeito: "Placa-mãe em curto", quantidade: 142 },
          { defeito: "Problemas Software", quantidade: 200 },
        ]);
        setAtualizacoes([
          { titulo: "50 Laptops doados", subtitulo: "Para Amor Inclusivo", tempo: "2 horas atrás", icone: "volunteer_activism" },
          { titulo: "Ferramentas que chegaram", subtitulo: "32 lotes", tempo: "5 horas atrás", icone: "inventory_2" },
          { titulo: "Porcentagem descartados", subtitulo: "45% Descartados / 55% Doados", tempo: "10 dias", icone: "build_circle" },
        ]);
          setFrequencia([
          { tipo: "Notebook", quantidade: 70, porcentagem: 35 },
          { tipo: "Computador", quantidade: 50, porcentagem: 25 },
          { tipo: "Periférico", quantidade: 40, porcentagem: 20 },
          { tipo: "Peças", quantidade: 40, porcentagem: 20 },
        ]);
        setDataLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          
          {/* Visão Geral + Action Button */}
          <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-[#071e27] tracking-tighter mb-2">Visão Geral</h3>
            </div>
            <button 
              onClick={() => router.push('/Screens/Inventario')}
              className="bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Registrar Equipamento
            </button>

          </section>

          {/* KPI Cards - usando componente reutilizável StatCard */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="devices"
              label="Fila de triagem"
              value={loading ? '...' : (kpis?.filaTriagem ?? 0)}
              sub="Equipamentos aguardando"
              iconBgClass="bg-[#d6e3ff] text-[#00468c]"
              hoverAccent={true}
            />
            <StatCard
              icon="pending_actions"
              label="Status de peças"
              value={loading ? '...' : (kpis?.pecasFaltantes ?? 0)}
              sub="Peças faltantes, reposição"
              iconBgClass="bg-[#92f1fe] text-[#004f56]"
              hoverAccent={true}
            />
            <StatCard
              icon="cached"
              label="Processados no turno"
              value={loading ? '...' : (kpis?.processadosTurno ?? '0/0')}
              sub="4h restantes no turno"
              iconBgClass="bg-[#a3f69c] text-[#005312]"
              hoverAccent={true}
            />
            <StatCard
              icon="handshake"
              label="Sanitização de Dados"
              value={loading ? '...' : (kpis?.aguardandoSanitizacao ?? 0)}
              sub="Aguardando formatação segura"
              iconBgClass="bg-[#007984] text-white"
              hoverAccent={true}
            />
          </section>


          {/* Pareto + Últimas Atualizações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Pareto de Defeitos - componente reutilizável */}
            <ParetoChart 
              data={pareto} 
              dataLoaded={dataLoaded} 
            />
            
            {/* Últimas Atualizações - componente reutilizável */}
            <RecentUpdates 
              items={atualizacoes} 
              onLogCompleto={() => {
                // Scroll to the equipment detail section or open full log (future)
                const el = document.getElementById('log1');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

          </div>


          {/* Bottom section: Frequência + Equipment Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Donut Chart - reutilizando CategoriesDonut */}
            {(() => {
              const donutSegments = frequencia.length > 0 
                ? frequencia.map((f, i) => ({
                    label: f.tipo,
                    percent: Math.round(f.porcentagem),
                    color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i] || '#64748b'
                  }))
                : [
                    { label: 'Notebook', percent: 35, color: '#3b82f6' },
                    { label: 'Computador', percent: 25, color: '#10b981' },
                    { label: 'Periférico', percent: 20, color: '#f59e0b' },
                    { label: 'Peças', percent: 20, color: '#ef4444' }
                  ];
              return (
                <CategoriesDonut 
                  segments={donutSegments} 
                  total={kpis?.totalInventario ?? 0} 
                  title="Frequência de Tipos Cadastrados" 
                />
              );
            })()}


            {/* Equipment Detail Card (mantido estático por enquanto) */}
            <div id="log1" className="w-full bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Notebook Dell G15</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">ID: #40592</h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">
                    Em Manutenção
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Histórico de Atividade</h4>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <div className="w-px h-full bg-gray-200 my-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-gray-700 font-bold">Troca de pasta térmica concluída</p>
                      <p className="text-xs text-gray-400 mt-1">Hoje, às 14:30 por Técnico Silva</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-px h-full bg-gray-200 my-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-gray-700 font-bold">Aguardando peça (SSD NVMe 500GB)</p>
                      <p className="text-xs text-gray-400 mt-1">Ontem às 09:15</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 italic font-medium line-through">Entrada no sistema: Falha no boot</p>
                      <p className="text-xs text-gray-400 mt-1">05 de Mai</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                <button className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                  Ver Detalhes
                </button>
                <button className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                  Adicionar Log
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
