'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Button from '@/components/Button';
import StatCard from '@/components/StatCard';
import VolumeBarChart from '@/components/VolumeBarChart';
import CategoriesDonut from '@/components/CategoriesDonut';
import { api, listFromResponse } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { mascaraCNPJ, mascaraTelefone, validarEmail } from '@/utils/masks';

interface EquipamentoDoacao {
  id: number;
  codigo: string;
  modelo: string;
  especificacoes: string;
  lote: string;
  status: string;
  tipo?: string;
  instituicaoId?: number;
  aprovadoPor?: string;
}

interface SolicitacaoRow {
  id: number;
  instituicao: string;
  cnpj: string;
  itens: string;
  itensDetalhe: string;
  data: string;
  prioridade: string;
  status: string;
  protocolo: string;
}

export default function DoacoesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoRow | null>(null);

  // Modal Nova Instituição
  const [showNovaInstituicao, setShowNovaInstituicao] = useState(false);
  const [novaInst, setNovaInst] = useState({ nome: '', cnpj: '', responsavel: '', telefone: '', email: '' });
  const [salvandoInst, setSalvandoInst] = useState(false);
  const [erroInst, setErroInst] = useState<string | null>(null);

  const [equipamentosDoacao, setEquipamentosDoacao] = useState<EquipamentoDoacao[]>([]);
  const [instituicoes, setInstituicoes] = useState<Array<{id: number, nome: string}>>([]);
  const [searchDoacao, setSearchDoacao] = useState('');
  const [loadingDoacao, setLoadingDoacao] = useState(true);
  const [doacaoError, setDoacaoError] = useState(false);

  const [kpis, setKpis] = useState<{ total: number; aprovadas: number; pendentes: number; itensDoados: number } | null>(null);
  const [volumeData, setVolumeData] = useState<Array<{month: string; height: number; value?: number; isHighlight?: boolean}>>([]);
  const [categorias, setCategorias] = useState<Array<{label: string; percent: number; color: string}>>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashError, setDashError] = useState(false);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [kpisRes, volumeRes, catsRes, solsRes] = await Promise.all([
          api.get('/solicitacoes/kpis'),
          api.get('/solicitacoes/volume-mensal'),
          api.get('/solicitacoes/top-categorias'),
          api.get('/solicitacoes'),
        ]);

        setKpis(kpisRes.data as { total: number; aprovadas: number; pendentes: number; itensDoados: number });

        const mapped: SolicitacaoRow[] = listFromResponse<any>(solsRes.data).map((s: any) => ({
          id: s.id,
          instituicao: s.instituicaoNome || 'Instituição',
          cnpj: s.cnpj || '',
          itens: `${s.itensCount ?? 0} Equipamentos`,
          itensDetalhe: s.itensResumo || 'Diversos',
          data: new Date(s.dataSolicitacao).toLocaleDateString('pt-BR'),
          prioridade: s.prioridade || 'Média',
          status: s.status === 'Aprovada' ? 'Aprovado' : s.status,
          protocolo: s.protocolo,
        }));
        setSolicitacoes(mapped);

        const catsList = listFromResponse<any>(catsRes.data);
        const catsTotal = catsList.reduce((sum, c) => sum + (Number(c.qtd) || 0), 0);
        const cats = catsList.map((c: any) => {
          const qtd = Number(c.qtd) || 0;
          const percent = catsTotal > 0 ? Math.round((qtd * 100) / catsTotal) : 0;
          return {
            label: c.tipo || c.label || 'Categoria',
            percent,
            color: '#15803d',
          };
        });
        setCategorias(cats);

      } catch (e) {
        console.error('Erro ao carregar dados reais de doações:', e);
        setDashError(true);
        setKpis(null);
        setSolicitacoes([]);
        setVolumeData([]);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRealData();
  }, []);

  useEffect(() => {
    const fetchEquipamentosDoacao = async () => {
      setLoadingDoacao(true);
    try {
      const [equipRes, instRes] = await Promise.all([
        api.get<EquipamentoDoacao[]>('/Equipamentos', { params: { status: 'AguardandoDoacao' } }),
        api.get('/Instituicoes'),
      ]);

      const equipData = listFromResponse<EquipamentoDoacao>(equipRes.data);
      setEquipamentosDoacao(equipData);
      const instList = listFromResponse<{ id: number; nome: string }>(instRes.data).map((i: any) => ({
        id: i.id ?? i.Id,
        nome: i.nome ?? i.Nome ?? 'Instituição',
      }));
      setInstituicoes(instList);
      setDoacaoError(false);

      } catch (e) {
        console.error('Erro ao carregar equipamentos para doação:', e);
        setDoacaoError(true);
        setEquipamentosDoacao([]);
        setInstituicoes([]);
      } finally {
        setLoadingDoacao(false);
      }
    };
    fetchEquipamentosDoacao();
  }, []);

  const handleNovoChange = (field: string, value: string) => {
    if (field === 'cnpj') value = mascaraCNPJ(value);
    if (field === 'telefone') value = mascaraTelefone(value);
    setNovaInst(prev => ({ ...prev, [field]: value }));
    setErroInst(null);
  };

  const handleCadastrarInstituicao = async () => {
    setErroInst(null);

    if (!novaInst.nome.trim()) {
      setErroInst('Informe o nome da instituição.');
      return;
    }
    if (!validarEmail(novaInst.email)) {
      setErroInst('Email inválido.');
      return;
    }
    const cnpjDigits = novaInst.cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      setErroInst('CNPJ inválido. Formato: 00.000.000/0000-00');
      return;
    }
    const telDigits = novaInst.telefone.replace(/\D/g, '');
    if (telDigits.length < 10 || telDigits.length > 11) {
      setErroInst('Telefone inválido. Formato: (11) 99999-9999');
      return;
    }

    setSalvandoInst(true);
    try {
      await api.post('/Instituicoes', {
        nome: novaInst.nome.trim(),
        cnpj: novaInst.cnpj.trim(),
        responsavel: novaInst.responsavel.trim(),
        telefone: novaInst.telefone.trim(),
        email: novaInst.email.trim(),
      });
      alert("Instituição cadastrada com sucesso!");
      setShowNovaInstituicao(false);
      setNovaInst({ nome: '', cnpj: '', responsavel: '', telefone: '', email: '' });
      const instRes = await api.get('/Instituicoes');
      const instList = (instRes.data as any[] || []).map((i: any) => ({
        id: i.id || i.Id,
        nome: i.nome || i.Nome || 'Instituição'
      }));
      setInstituicoes(instList);
    } catch (e) {
      alert("Erro ao cadastrar instituição.");
    } finally {
      setSalvandoInst(false);
    }
  };

  const handleRemoverDoacao = async (eqId: number) => {
    if (!confirm(`Cancelar aprovação de doação? O status do equipamento será revertido.`)) return;

    try {
      await api.post(`/Equipamentos/${eqId}/cancelar-doacao`);
      setEquipamentosDoacao(prev => prev.filter(item => item.id !== eqId));
    } catch (error) {
      console.error('Erro ao cancelar doação:', error);
      alert('Falha ao cancelar. Tente novamente.');
    }
  };

  return (
    <div className="text-on-surface min-h-screen flex overflow-x-hidden bg-background">
      <div id="sidebar-overlay" className={`fixed inset-0 bg-black/50 z-[60] lg:hidden transition-opacity ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      <div id="drawer-overlay" className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[80] transition-opacity ${drawerOpen ? '' : 'hidden'}`} onClick={() => setDrawerOpen(false)} />

      <Sidebar
        userType="internal"
        userName={currentUserName}
        userRole={currentUserRole}
        userPhoto={currentUserPhoto}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen w-full">
        <Header
          title="Aprovação de Doações"
          searchPlaceholder="Buscar instituição ou protocolo..."
          showNotificationBadge={true}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 pb-12">
          {loading ? (
            <div className="text-center py-12 text-on-surface-variant">Carregando dados reais do banco de dados...</div>
          ) : dashError ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Não foi possível carregar os dados do painel.</p>
              <p className="text-gray-400 text-sm mt-2">Verifique a conexão com o servidor e tente novamente.</p>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <section className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tighter mb-2">Painel de Análise</h3>
                  <p className="text-sm font-medium text-on-surface-variant">Gerencie e avalie as solicitações de instituições parceiras.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    className="flex items-center gap-2 w-full sm:w-auto"
                    onClick={() => {
                      if (equipamentosDoacao.length === 0) {
                        alert("Nenhum equipamento para exportar.");
                        return;
                      }
                      const csv = "data:text/csv;charset=utf-8,"
                        + "Codigo,Modelo,Especificacoes,Lote,Status,InstituicaoId\n"
                        + equipamentosDoacao.map(e => `${e.codigo},"${e.modelo}","${e.especificacoes}",${e.lote},${e.status},${e.instituicaoId || ''}`).join("\n");
                      const link = document.createElement("a");
                      link.href = encodeURI(csv);
                      link.download = `equipamentos_doacao_${new Date().toISOString().slice(0,10)}.csv`;
                      link.click();
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Exportar Relatório
                  </Button>

                  <button
                    onClick={() => setShowNovaInstituicao(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 active:scale-[0.985] transition-all w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-base">add_business</span>
                    Nova Instituição
                  </button>
                </div>
              </section>

              {/* Stats Cards - dados reais ou vazio */}
              {kpis ? (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon="assignment" label="Total Solicitações" value={kpis.total} sub="Registradas no sistema" color="blue" />
                  <StatCard icon="verified" label="Aprovadas" value={kpis.aprovadas} sub="Instituições atendidas" color="green" />
                  <StatCard icon="hourglass_empty" label="Pendentes" value={kpis.pendentes} sub="Aguardando análise técnica" color="yellow" />
                  <StatCard icon="inventory_2" label="Itens Doados" value={kpis.itensDoados} sub="Equipamentos entregues" color="purple" />
                </section>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum dado de KPIs disponível.</p>
              )}

              {/* Charts */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <VolumeBarChart data={volumeData.length ? volumeData : []} />
                <CategoriesDonut
                  total={kpis?.itensDoados ?? 0}
                  segments={categorias.length ? categorias : []}
                />
              </section>

              {/* Tabela Equipamentos Aguardando Aprovação */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-[#071e27]">Equipamentos Aguardando Aprovação de Doação</h3>
                    <p className="text-sm text-gray-600">Vindos da Triagem • Selecione a instituição e aprove</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por código ou modelo..."
                    value={searchDoacao}
                    onChange={(e) => setSearchDoacao(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b]"
                  />
                </div>

                {loadingDoacao ? (
                  <div className="text-center py-8 text-gray-500">Carregando equipamentos...</div>
                ) : doacaoError ? (
                  <div className="text-center py-8 text-gray-400">Não foi possível carregar equipamentos para doação.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500 font-bold uppercase tracking-widest text-xs">
                          <th className="py-3 px-4">Código</th>
                          <th className="py-3 px-4">Modelo</th>
                          <th className="py-3 px-4">Especificações</th>
                          <th className="py-3 px-4">Tipo</th>
                          <th className="py-3 px-4">Lote</th>
                          <th className="py-3 px-4">Instituição</th>
                          <th className="py-3 px-4">Responsável</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipamentosDoacao
                          .filter(eq =>
                            eq.codigo.toLowerCase().includes(searchDoacao.toLowerCase()) ||
                            eq.modelo.toLowerCase().includes(searchDoacao.toLowerCase())
                          )
                          .map((eq) => (
                            <tr key={eq.id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-4 font-mono text-sm text-blue-700 font-bold">{eq.codigo}</td>
                              <td className="py-4 px-4 font-bold text-[#071e27] text-base">{eq.modelo}</td>
                              <td className="py-4 px-4 text-gray-600 text-xs max-w-xs truncate">{eq.especificacoes}</td>
                              <td className="py-4 px-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                  {eq.tipo || 'N/A'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-500">{eq.lote}</td>

                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={eq.instituicaoId || ''}
                                    onChange={(e) => {
                                      const novaInstId = parseInt(e.target.value);
                                      setEquipamentosDoacao(prev =>
                                        prev.map(item =>
                                          item.id === eq.id ? { ...item, instituicaoId: novaInstId } : item
                                        )
                                      );
                                    }}
                                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0d631b]"
                                  >
                                    <option value="">Selecione...</option>
                                    {instituicoes.map(inst => (
                                      <option key={inst.id} value={inst.id}>{inst.nome}</option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={async () => {
                                      if (!eq.instituicaoId) {
                                        alert('Selecione uma instituição primeiro.');
                                        return;
                                      }
                                      try {
                                        await api.post(`/Equipamentos/${eq.id}/aprovar-doacao`, {
                                          InstituicaoId: eq.instituicaoId,
                                          AprovadoPor: currentUserName || 'Técnico GSEI'
                                        });
                                        alert('Doação aprovada com sucesso!');
                                        setEquipamentosDoacao(prev => prev.filter(item => item.id !== eq.id));
                                      } catch (error) {
                                        console.error('Erro ao aprovar doação:', error);
                                        alert('Falha ao aprovar. Tente novamente.');
                                      }
                                    }}
                                    className="text-xs font-bold bg-[#0d631b] text-white px-3 py-1 rounded-lg hover:bg-green-800 transition"
                                  >
                                    Aprovar
                                  </button>
                                </div>
                              </td>

                              <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                                {eq.aprovadoPor || '— (aguardando)'}
                              </td>

                              <td className="py-4 px-4 text-right space-x-2">
                                <button
                                  onClick={() => setSelectedSolicitacao({ ...selectedSolicitacao!, id: eq.id })}
                                  className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  Detalhes
                                </button>
                                <button
                                  onClick={() => handleRemoverDoacao(eq.id)}
                                  className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  Cancelar
                                </button>
                              </td>
                            </tr>
                          ))}
                        {equipamentosDoacao.length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-gray-400">
                              {doacaoError ? 'Erro ao carregar dados.' : 'Nenhum equipamento aguardando aprovação de doação no momento.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <aside
        id="drawer"
        className={`fixed top-0 right-0 w-full md:w-[500px] h-full bg-white z-[90] shadow-2xl flex flex-col border-l border-gray-200 transform transition-transform duration-300 ${drawerOpen ? '' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Protocolo {selectedSolicitacao?.protocolo || '#SOL-XXXX'}</p>
            <h2 className="text-xl font-black text-gray-800 mt-1">Análise de Solicitação</h2>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {selectedSolicitacao && (
            <>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">domain</span> Dados da Instituição
                </h4>
                <div className="bg-surface-container-lowest border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Nome / Razão Social</p>
                    <p className="text-sm font-bold text-gray-800">{selectedSolicitacao.instituicao}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">CNPJ</p>
                      <p className="text-sm font-medium text-gray-700">{selectedSolicitacao.cnpj || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Telefone</p>
                      <p className="text-sm font-medium text-gray-700">{currentUserName ? '—' : '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Protocolo</p>
                    <p className="text-sm font-medium text-gray-700">{selectedSolicitacao.protocolo}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">inventory_2</span> Equipamentos Solicitados
                </h4>
                <p className="text-sm text-gray-600">{selectedSolicitacao.itens} — {selectedSolicitacao.itensDetalhe}</p>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Motivo da Solicitação</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl italic border border-gray-100">
                    Solicitação registrada em {selectedSolicitacao.data}. Prioridade: {selectedSolicitacao.prioridade}.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">history</span> Histórico
                </h4>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                  <div className="relative pl-6">
                    <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 ring-4 ring-white ${selectedSolicitacao.status === 'Pendente' ? 'bg-yellow-400' : selectedSolicitacao.status === 'Aprovado' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <p className="text-sm font-bold text-gray-800">{selectedSolicitacao.status}</p>
                    <p className="text-xs text-gray-500">Status atual</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1 ring-4 ring-white"></div>
                    <p className="text-sm font-bold text-gray-800">Solicitação Recebida</p>
                    <p className="text-xs text-gray-500">{selectedSolicitacao.data}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

          <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-3">
            <Button variant="secondary" className="col-span-2">Solicitar mais Informações</Button>
            <Button variant="danger" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100">Negar Pedido</Button>
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 shadow-md shadow-green-600/20">Aprovar Doação</Button>
          </div>
      </aside>

      {/* Modal Nova Instituição */}
      {showNovaInstituicao && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b bg-gray-50/70 flex justify-between items-center">
              <h3 className="font-black text-lg text-[#071e27]">Cadastrar Nova Instituição</h3>
              <button onClick={() => { setShowNovaInstituicao(false); setErroInst(null); }} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              {erroInst && <p className="text-red-600 text-xs font-bold bg-red-50 rounded-lg px-3 py-2">{erroInst}</p>}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">NOME DA INSTITUIÇÃO *</label>
                <input value={novaInst.nome} onChange={e => handleNovoChange('nome', e.target.value)} className="w-full border rounded-2xl px-4 py-3" placeholder="Escola Municipal Nova Era" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">CNPJ *</label>
                  <input value={novaInst.cnpj} onChange={e => handleNovoChange('cnpj', e.target.value)} className="w-full border rounded-2xl px-4 py-3 font-mono" placeholder="00.000.000/0000-00" maxLength={18} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">RESPONSÁVEL *</label>
                  <input value={novaInst.responsavel} onChange={e => handleNovoChange('responsavel', e.target.value)} className="w-full border rounded-2xl px-4 py-3" placeholder="Maria Silva" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">TELEFONE *</label>
                  <input value={novaInst.telefone} onChange={e => handleNovoChange('telefone', e.target.value)} className="w-full border rounded-2xl px-4 py-3 font-mono" placeholder="(11) 99999-0000" maxLength={15} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">E-MAIL *</label>
                  <input type="email" value={novaInst.email} onChange={e => handleNovoChange('email', e.target.value)} className="w-full border rounded-2xl px-4 py-3" placeholder="contato@instituicao.org" />
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 flex gap-3 justify-end">
              <button onClick={() => { setShowNovaInstituicao(false); setErroInst(null); }} className="px-5 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl">Cancelar</button>
              <button
                disabled={salvandoInst}
                onClick={handleCadastrarInstituicao}
                className="px-6 py-2 bg-[#0d631b] text-white font-bold rounded-2xl text-sm disabled:opacity-60"
              >
                {salvandoInst ? "Salvando..." : "Cadastrar Instituição"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
