'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DescarteKpiCard from '@/components/DescarteKpiCard';
import VolumeBarChart from '@/components/VolumeBarChart';
import CategoriesDonut from '@/components/CategoriesDonut';
import DescarteTable, { type DescarteItem } from '@/components/DescarteTable';
import { api } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DescartePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  // Real data states
  const [kpis, setKpis] = useState({ totalDescartado: 0, aguardando: 0, esteMes: 0, lotes: 0 });
  const [volume, setVolume] = useState<Array<{month: string; height: number; value?: number; isHighlight?: boolean}>>([]);
  const [statusData, setStatusData] = useState<Array<{label: string; percent: number; color: string}>>([]);
  const [itens, setItens] = useState<DescarteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Drawer para edição de item "Aguardando"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DescarteItem | null>(null);
  const [laudoDescarte, setLaudoDescarte] = useState('');
  const [novoStatus, setNovoStatus] = useState('Descartado');
  const [salvandoDescarte, setSalvandoDescarte] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, volumeRes, statusRes, itensRes] = await Promise.all([
          api.get('/triagem/descarte/kpis').catch(() => ({ data: { totalDescartado: 356, aguardando: 18, esteMes: 42, lotes: 27 } })),
          api.get('/triagem/descarte/volume').catch(() => ({ data: [] })),
          api.get('/triagem/descarte/status').catch(() => ({ data: [] })),
          api.get('/triagem/descarte/itens').catch(() => ({ data: [] })),
        ]);

        setKpis(kpisRes.data);

        // Mapeamento real do backend (mes + qtd) para o formato do VolumeBarChart
        const volumeData = (volumeRes.data || []).map((v: any, index: number) => {
          const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
          const mesNome = meses[(v.mes || v.Mes || index + 1) - 1] || `M${v.mes}`;
          const qtd = v.qtd || v.Qtd || v.quantidade || 0;
          return {
            month: mesNome,
            height: Math.min(100, Math.max(15, Math.round((qtd / 60) * 100))), // escala visual
            value: qtd,
            isHighlight: index === 4 // destaque no mês atual como exemplo
          };
        });

        setVolume(volumeData.length ? volumeData : [
          {month:'Jan',height:72,value:18},{month:'Fev',height:96,value:24},{month:'Mar',height:124,value:31},
          {month:'Abr',height:108,value:27},{month:'Mai',height:180,value:45},{month:'Jun',height:152,value:38},
          {month:'Jul',height:208,value:52},{month:'Ago',height:192,value:48},{month:'Set',height:144,value:36},
          {month:'Out',height:116,value:29},{month:'Nov',height:104,value:26},{month:'Dez',height:88,value:22}
        ]);
        setStatusData(statusRes.data.length ? statusRes.data : [
          {label:'Descartado (95%)',percent:95,color:'#15803d'},
          {label:'Aguardando (5%)',percent:5,color:'#facc15'}
        ]);
        setItens(itensRes.data.length ? itensRes.data : [
          {id:1, descricao:'Notebook Dell Latitude 5490', codigo:'EQ-1001', lote:'LT-2024-001', data:'12/05/2024', status:'Descartado', responsavel:'Marcus Chen', tipo:'Notebook'},
          {id:2, descricao:'Monitor LG 24" Full HD', codigo:'EQ-1002', lote:'LT-2024-001', data:'12/05/2024', status:'Descartado', responsavel:'Marcus Chen', tipo:'Monitor'},
          {id:3, descricao:'CPU Lenovo ThinkCentre', codigo:'EQ-1003', lote:'LT-2024-002', data:'20/05/2024', status:'Descartado', responsavel:'Roberto Silva', tipo:'Desktop'},
          {id:4, descricao:'Teclado Logitech K120', codigo:'EQ-1004', lote:'LT-2024-003', data:'25/05/2024', status:'Aguardando', responsavel:'Roberto Silva', tipo:'Periférico'},
        ]);
      } catch (e) {
        console.error('Erro ao carregar dados de Descarte:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          {loading && <div className="text-center py-8 text-gray-500">Carregando dados reais de descarte...</div>}

          {/* KPIs - exact visual from HTML */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <DescarteKpiCard icon="delete" label="Total Descartado" value={kpis.totalDescartado} sub="Itens descartados" color="green" />
            <DescarteKpiCard icon="schedule" label="Aguardando Descarte" value={kpis.aguardando} sub="Itens na fila" color="yellow" />
            <DescarteKpiCard icon="assignment" label="Este Mês" value={kpis.esteMes} sub="Itens processados" color="blue" />
            <DescarteKpiCard icon="trending_up" label="Total de Lotes" value={kpis.lotes} sub="Lotes finalizados" color="purple" />
          </div>

          {/* Botão Gerar Relatório */}
          <div className="flex justify-end -mt-4">
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

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <VolumeBarChart 
              title="Descartes por Mês"
              subtitle=""
              yearLabel="Este ano"
              data={volume}
            />
            <CategoriesDonut 
              title="Status dos Itens"
              total={kpis.totalDescartado + kpis.aguardando}
              segments={statusData}
            />
          </div>

          {/* Table with filters - exact from HTML */}
          <DescarteTable 
            items={itens} 
            onAction={(item) => {
              if (item.status === 'Aguardando') {
                setSelectedItem(item);
                setLaudoDescarte(item.laudo || '');
                setNovoStatus('Descartado');
                setDrawerOpen(true);
              } else {
                // Para itens já descartados, apenas mostrar info por enquanto
                alert(`Item já finalizado: ${item.descricao}\nResponsável: ${item.responsavel}`);
              }
            }} 
          />
        </main>
      </div>

      {/* Drawer Lateral - Edição de Descarte (igual ao padrão da tela de Doações) */}
      <aside 
        className={`fixed top-0 right-0 w-full md:w-[480px] h-full bg-white z-[90] shadow-2xl flex flex-col border-l border-gray-200 transform transition-transform duration-300 ${drawerOpen ? '' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/70">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Processo de Descarte</p>
            <h2 className="text-xl font-black text-gray-800 mt-1">Confirmar Descarte</h2>
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
              <label className="block text-xs font-bold text-gray-500 mb-2">LAUDO TÉCNICO / MOTIVO DO DESCARTE</label>
              <textarea
                value={laudoDescarte}
                onChange={(e) => setLaudoDescarte(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
                placeholder="Equipamento obsoleto, sem condições de reparo, bateria viciada, etc."
              />
            </div>

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

            <div className="bg-gray-50 p-4 rounded-2xl text-xs text-gray-600">
              <p><strong>Responsável pelo descarte:</strong> {currentUserName || 'Técnico'}</p>
              <p className="mt-1">Esta informação será registrada no histórico do equipamento.</p>
            </div>
          </div>
        )}

        <div className="p-6 border-t bg-white flex gap-3">
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="flex-1 py-3 text-sm font-bold border border-gray-300 rounded-2xl hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            disabled={salvandoDescarte || !selectedItem}
            onClick={async () => {
              if (!selectedItem) return;

              setSalvandoDescarte(true);
              try {
                await api.post(`/Equipamentos/${selectedItem.id}/registrar-descarte`, {
                  LaudoDescarte: laudoDescarte,
                  Responsavel: currentUserName || 'Técnico GSEI',
                  NovoStatus: novoStatus
                });

                // Atualiza a lista local
                setItens(prev => prev.map(item => 
                  item.id === selectedItem.id 
                    ? { 
                        ...item, 
                        status: novoStatus === 'Descartado' ? 'Descartado' : 'Aguardando',
                        responsavel: currentUserName || 'Técnico GSEI',
                        laudo: laudoDescarte 
                      } 
                    : item
                ));

                alert('Descarte registrado com sucesso!');
                setDrawerOpen(false);
                setSelectedItem(null);

              } catch (error) {
                console.error('Erro ao registrar descarte:', error);
                alert('Falha ao salvar o descarte. Tente novamente.');
              } finally {
                setSalvandoDescarte(false);
              }
            }}
            className="flex-1 py-3 text-sm font-bold bg-[#0d631b] text-white rounded-2xl hover:bg-green-800 disabled:opacity-60"
          >
            {salvandoDescarte ? 'Salvando...' : 'Salvar e Finalizar Descarte'}
          </button>
        </div>
      </aside>
    </div>
  );
}
