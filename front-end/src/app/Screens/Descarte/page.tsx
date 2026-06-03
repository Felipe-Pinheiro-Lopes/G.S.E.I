'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DescarteKpiCard from '@/components/DescarteKpiCard';
import VolumeBarChart from '@/components/VolumeBarChart';
import CategoriesDonut from '@/components/CategoriesDonut';
import DescarteTable, { type DescarteItem } from '@/components/DescarteTable';
import { api, listFromResponse } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface DescarteKpis {
  totalDescartado: number;
  aguardando: number;
  esteMes: number;
  lotes: number;
}

export default function DescartePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [kpis, setKpis] = useState<DescarteKpis | null>(null);
  const [volume, setVolume] = useState<Array<{month: string; height: number; value?: number; isHighlight?: boolean}>>([]);
  const [statusData, setStatusData] = useState<Array<{label: string; percent: number; color: string}>>([]);
  const [itens, setItens] = useState<DescarteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selectedItem, setSelectedItem] = useState<DescarteItem | null>(null);
  const [laudoDescarte, setLaudoDescarte] = useState('');
  const [novoStatus, setNovoStatus] = useState('AguardandoDescarte');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [salvandoDescarte, setSalvandoDescarte] = useState(false);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [porPagina] = useState(10);
  const [totalItens, setTotalItens] = useState(0);

  const startIndex = (paginaAtual - 1) * porPagina;
  const endIndex = Math.min(startIndex + porPagina, totalItens);

  const fetchDescarteItens = async (pagina: number = 1) => {
    try {
      setLoading(true);
      const res = await api.get('/triagem/descarte/itens', { params: { pagina, porPagina: 10 } });
      const data = res.data || {};
      setItens(data.itens || []);
      setTotalPaginas(data.totalPaginas || 0);
      setPaginaAtual(data.pagina || pagina);
      setTotalItens(data.totalItens || 0);
    } catch (err) {
      console.error('Erro ao carregar itens de descarte:', err);
      setItens([]);
      setTotalPaginas(0);
      setTotalItens(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, volumeRes, statusRes] = await Promise.all([
          api.get<DescarteKpis>('/triagem/descarte/kpis'),
          api.get('/triagem/descarte/volume'),
          api.get('/triagem/descarte/status'),
        ]);

        const kpisData = kpisRes.data;
        const aguardandoDoBanco = kpisData.aguardando ?? 0;
        setKpis({
          totalDescartado: kpisData.totalDescartado ?? 0,
          aguardando: aguardandoDoBanco,
          esteMes: kpisData.esteMes ?? 0,
          lotes: kpisData.lotes ?? 0,
        });

        const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        const mappedVolume = listFromResponse<any>(volumeRes.data).map((v: any, index: number) => {
          const mesNome = meses[(v.mes || v.Mes || index + 1) - 1] || `M${v.mes}`;
          const qtd = v.qtd || v.Qtd || v.quantidade || 0;
          return {
            month: mesNome,
            height: Math.min(100, Math.max(15, Math.round((qtd / 60) * 100))),
            value: qtd,
            isHighlight: index === 3,
          };
        });
        setVolume(mappedVolume);
        setStatusData(listFromResponse<any>(statusRes.data));
        setLoadError(false);
      } catch (e) {
        console.error('Erro ao carregar dados de Descarte:', e);
        setLoadError(true);
        setKpis(null);
        setVolume([]);
        setStatusData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDescarteItens(1);
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchDescarteItens(paginaAtual);
    }
  }, [paginaAtual]);

  const handleRowClick = (item: DescarteItem) => {
    setSelectedItem(item);
    setLaudoDescarte(item.laudo || '');
    setNovoStatus(item.status === 'Descartado' ? 'Descartado' : 'AguardandoDescarte');
    setDrawerOpen(true);
  };

  const handleFecharDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
    setLaudoDescarte('');
  };

  const handleRegistrarDescarte = async () => {
    if (!selectedItem) return;
    setSalvandoDescarte(true);
    try {
      await api.post(`/Equipamentos/${selectedItem.id}/registrar-descarte`, {
        LaudoDescarte: selectedItem.laudo || laudoDescarte,
        Responsavel: currentUserName || 'Técnico GSEI',
        NovoStatus: novoStatus,
      });

      setItens(prev => prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              status: novoStatus === 'Descartado' ? 'Descartado' : 'AguardandoDescarte',
              responsavel: currentUserName || 'Técnico GSEI',
              laudo: laudoDescarte,
            }
          : item
      ));

      setDrawerOpen(false);
      setSelectedItem(null);
      setLaudoDescarte('');
      await fetchDescarteItens(paginaAtual);
    } catch (error) {
      console.error('Erro ao registrar descarte:', error);
    } finally {
      setSalvandoDescarte(false);
    }
  };

  return (
    <div className="bg-[#f3faff] text-[#071e27] min-h-screen">
      <div className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />

      <Sidebar
        userType="internal"
        userName={currentUserName}
        userRole={currentUserRole}
        userPhoto={currentUserPhoto}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header
          title="Controle de Descarte"
          searchPlaceholder="Buscar item, ID ou lote..."
          showNotificationBadge={false}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8 pb-12">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando dados de descarte...</div>
          ) : loadError ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Não foi possível carregar os dados de descarte.</p>
              <p className="text-gray-400 text-sm mt-2">Verifique a conexão com o servidor.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <DescarteKpiCard icon="delete" label="Total Descartado" value={kpis?.totalDescartado ?? 0} sub="Itens descartados" color="green" />
                <DescarteKpiCard icon="schedule" label="Aguardando Descarte" value={kpis?.aguardando ?? 0} sub="Itens na fila" color="yellow" />
                <DescarteKpiCard icon="assignment" label="Este Mês" value={kpis?.esteMes ?? 0} sub="Itens processados" color="blue" />
                <DescarteKpiCard icon="trending_up" label="Total de Lotes" value={kpis?.lotes ?? 0} sub="Lotes finalizados" color="purple" />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const csv = "data:text/csv;charset=utf-8,"
                      + "Codigo,Descricao,Lote,Status,Responsavel\n"
                      + itens.map(i => `${i.codigo},"${i.descricao}",${i.lote},${i.status},${i.responsavel}`).join("\n");
                    const link = document.createElement("a");
                    link.href = encodeURI(csv);
                    link.download = `relatorio_descarte_${new Date().toISOString().slice(0,10)}.csv`;
                    link.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  Gerar Relatório CSV
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <VolumeBarChart
                  title="Descartes por Mês"
                  subtitle=""
                  yearLabel="Este ano"
                  data={volume}
                />
                <CategoriesDonut
                  title="Status dos Itens"
                  total={(kpis?.totalDescartado ?? 0) + (kpis?.aguardando ?? 0)}
                  segments={statusData}
                />
              </div>

              <DescarteTable
                items={itens}
                onAction={(item) => handleRowClick(item)}
              />

              {/* Paginação responsiva e funcional */}
              {totalPaginas > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-5 border-t border-gray-100 bg-white rounded-3xl">
                  <span className="text-sm text-gray-600">
                    Mostrando <span className="font-bold text-gray-900">{startIndex + 1}</span> a <span className="font-bold text-gray-900">{endIndex}</span> de <span className="font-bold text-gray-900">{totalItens}</span> itens
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                      disabled={paginaAtual <= 1}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Página anterior"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    {(() => {
                      const pagesToShow: number[] = [];
                      const maxVisible = 5;
                      if (totalPaginas <= maxVisible) {
                        for (let i = 1; i <= totalPaginas; i++) pagesToShow.push(i);
                      } else {
                        pagesToShow.push(1);
                        let start = Math.max(2, paginaAtual - 1);
                        let end = Math.min(totalPaginas - 1, paginaAtual + 1);
                        if (paginaAtual <= 2) end = 3;
                        if (paginaAtual >= totalPaginas - 1) start = totalPaginas - 2;
                        if (start > 2) pagesToShow.push(-1);
                        for (let i = start; i <= end; i++) pagesToShow.push(i);
                        if (end < totalPaginas - 1) pagesToShow.push(-2);
                        pagesToShow.push(totalPaginas);
                      }

                      return pagesToShow.map((page, idx) => {
                        if (page < 0) {
                          return (
                            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-xs">
                              ...
                            </span>
                          );
                        }
                        const isActive = page === paginaAtual;
                        return (
                          <button
                            key={page}
                            onClick={() => setPaginaAtual(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                              isActive
                                ? 'bg-[#0d631b] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}

                    <button
                      onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                      disabled={paginaAtual >= totalPaginas}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Próxima página"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <aside
        className={`fixed top-0 right-0 w-full md:w-[480px] h-full bg-white z-[90] shadow-2xl flex flex-col border-l border-gray-200 transform transition-transform duration-300 ${drawerOpen ? '' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/70">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Processo de Descarte</p>
            <h2 className="text-xl font-black text-gray-800 mt-1">
              {selectedItem?.status === 'Descartado' ? 'Detalhes do Descarte' : 'Confirmar Descarte'}
            </h2>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {selectedItem && (
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-500">Equipamento</p>
              <p className="font-bold text-lg">{selectedItem.descricao}</p>
              <p className="text-sm text-gray-600">{selectedItem.codigo} • {selectedItem.lote}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500">LAUDO TÉCNICO / MOTIVO DO DESCARTE</label>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 whitespace-pre-wrap">
                {laudoDescarte || selectedItem.laudo || 'Laudo não disponível.'}
              </div>
            </div>

            {selectedItem.status !== 'Descartado' && (
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">STATUS FINAL</label>
                <select
                  value={novoStatus}
                  onChange={(e) => setNovoStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
                >
                  <option value="Descartado">Descartado (Finalizar)</option>
                  <option value="AguardandoDescarte">Manter como Aguardando</option>
                </select>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600">
              <p><strong>Responsável pelo descarte:</strong> {currentUserName || 'Técnico'}</p>
              <p className="mt-1">Esta informação será registrada no histórico do equipamento.</p>
            </div>
          </div>
        )}

        {selectedItem?.status !== 'Descartado' && (
          <div className="p-6 border-t bg-white flex gap-3">
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex-1 py-3 text-sm font-bold border border-gray-300 rounded-2xl hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              disabled={salvandoDescarte || !selectedItem}
              onClick={handleRegistrarDescarte}
              className="flex-1 py-3 text-sm font-bold bg-[#0d631b] text-white rounded-2xl hover:bg-green-800 disabled:opacity-60"
            >
              {salvandoDescarte ? 'Salvando...' : 'Salvar e Finalizar Descarte'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
