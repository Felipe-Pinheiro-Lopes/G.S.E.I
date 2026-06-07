'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { api, listFromResponse } from '@/services/api';
import ChecklistItem from '@/components/ChecklistItem';
import DestinationOption from '@/components/DestinationOption';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Equipamento {
  id: number;
  codigo: string;
  modelo: string;
  especificacoes: string;
  lote: string;
  status: string;
  responsavel?: string;   // Técnico que reivindicou (usado em Em Andamento)
}

interface TriagemRegistro {
  id: number;
  equipamentoId: number;
  checklist: string[];
  laudoTecnico: string;
  destino: string;
  dataTriagem: string;
  tecnicoResponsavel: string;
}

type Tab = 'fila' | 'andamento' | 'finalizados';

export default function TriagemPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('fila');

  const [fila, setFila] = useState<Equipamento[]>([]);
  const [emAndamento, setEmAndamento] = useState<Equipamento[]>([]);
  const [finalizados, setFinalizados] = useState<Equipamento[]>([]);

  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<Equipamento | null>(null);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [laudo, setLaudo] = useState('');
  const [destino, setDestino] = useState('');
  const [loading, setLoading] = useState(false);
  const [historicoTriagens, setHistoricoTriagens] = useState<TriagemRegistro[]>([]);

  // Usuário logado de forma segura (evita Hydration Error)
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const carregarFila = async () => {
    try {
      const res = await api.get<Equipamento[]>('/Equipamentos', { params: { status: 'EmTriagem' } });
      const lista = listFromResponse<Equipamento>(res.data);
      const unicos = lista.filter((eq, index, self) =>
        index === self.findIndex(e => e.id === eq.id)
      );
      setFila(unicos);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
    }
  };

  const carregarEmAndamento = async () => {
    try {
      const res = await api.get<Equipamento[]>('/Equipamentos', { params: { status: 'EmAnalise' } });
      const lista = listFromResponse<Equipamento>(res.data);
      const unicos = lista.filter((eq, index, self) =>
        index === self.findIndex(e => e.id === eq.id)
      );

      // Enriquece cada equipamento com o responsável atual (última reivindicação)
      const enriquecidos = await Promise.all(
        unicos.map(async (eq) => {
          try {
            // Busca o último registro de triagem "EmAnalise" para esse equipamento
            const triagensRes = await api.get<any[]>(`/Triagem?equipamentoId=${eq.id}`);
            const ultimaReivindicacao = triagensRes.data
              .filter((t: any) => (t.destino || t.Destino) === "EmAnalise")
              .sort((a: any, b: any) => 
                new Date(b.dataTriagem || b.DataTriagem).getTime() - new Date(a.dataTriagem || a.DataTriagem).getTime()
              )[0];

            return {
              ...eq,
              responsavel: ultimaReivindicacao?.tecnicoResponsavel || ultimaReivindicacao?.TecnicoResponsavel || undefined
            };
          } catch {
            return eq;
          }
        })
      );

      setEmAndamento(enriquecidos);
    } catch (error) {
      console.error('Erro ao carregar em andamento:', error);
    }
  };

  const carregarFinalizados = async () => {
    try {
      const res = await api.get<Equipamento[]>('/Triagem/finalizados');
      const lista: Equipamento[] = Array.isArray(res.data) ? res.data : (res.data as any)?.itens ?? [];
      const unicos = lista.filter((eq: Equipamento, index: number, self: Equipamento[]) =>
        index === self.findIndex(e => e.id === eq.id)
      );
      setFinalizados(unicos);
    } catch (error) {
      console.error('Erro ao carregar finalizados:', error);
    }
  };

  const carregarHistoricoTriagem = async (equipamentoId: number) => {
    try {
      const res = await api.get<any[]>(`/Triagem/historico/${equipamentoId}`);
      const registros: TriagemRegistro[] = res.data.map((t: any) => ({
        id: t.id || t.Id,
        equipamentoId: t.equipamentoId || t.EquipamentoId,
        checklist: t.checklistJson ? JSON.parse(t.checklistJson) : (t.ChecklistJson ? JSON.parse(t.ChecklistJson) : []),
        laudoTecnico: t.laudoTecnico || t.LaudoTecnico || "",
        destino: t.destino || t.Destino || "",
        dataTriagem: t.dataTriagem || t.DataTriagem || "",
        tecnicoResponsavel: t.tecnicoResponsavel || t.TecnicoResponsavel || "Desconhecido"
      }));

      // Ordena do mais recente para o mais antigo
      registros.sort((a, b) => new Date(b.dataTriagem).getTime() - new Date(a.dataTriagem).getTime());

      setHistoricoTriagens(registros);
    } catch (error) {
      console.error('Erro ao carregar histórico de triagens:', error);
      setHistoricoTriagens([]);
    }
  };

  useEffect(() => {
    carregarFila();
    carregarEmAndamento();
    carregarFinalizados();
  }, []);

  const selecionarEquipamento = (eq: Equipamento) => {
    // Não permite selecionar cards de Finalizados para mover de volta
    if (activeTab === 'finalizados') {
      setEquipamentoSelecionado(eq);
      setChecklist([]);
      setLaudo('');
      setDestino('');

      // Carrega o histórico completo de laudos para este equipamento
      carregarHistoricoTriagem(eq.id);
      return;
    }

    // Controle de permissão para Em Andamento: só o responsável ou admin pode abrir
    if (activeTab === 'andamento') {
      const isDono = eq.responsavel === currentUserName;
      const isAdmin = currentUserRole.toLowerCase().includes("admin") || 
                      currentUserRole.toLowerCase().includes("gestor");

      if (!isDono && !isAdmin) {
        alert(`Este equipamento está em análise por ${eq.responsavel || "outro técnico"}.\nApenas o responsável ou um administrador pode continuar a triagem.`);
        return;
      }
    }

    if (equipamentoSelecionado?.id === eq.id) {
      setEquipamentoSelecionado(null);
      setChecklist([]);
      setLaudo('');
      setDestino('');
    } else {
      setEquipamentoSelecionado(eq);
      setChecklist([]);
      setLaudo('');
      setDestino('');
    }
  };

  const toggleChecklist = (item: string) => {
    setChecklist(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const enviarParaAndamento = async () => {
    if (!equipamentoSelecionado) return;

    setLoading(true);
    try {
      // Registra a reivindicação + responsável no histórico
      await api.post('/Triagem/iniciar', {
        equipamentoId: equipamentoSelecionado.id,
        tecnicoResponsavel: currentUserName
      });

      await Promise.all([carregarFila(), carregarEmAndamento()]);

      setEquipamentoSelecionado(null);
      setChecklist([]);
      setLaudo('');
      setDestino('');
      setActiveTab('andamento');
    } catch (error) {
      console.error('Erro ao enviar para andamento:', error);
      alert('Erro ao mover o equipamento para Em Andamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const voltarParaFila = async () => {
    if (!equipamentoSelecionado) return;

    setLoading(true);
    try {
      await api.post(`/Triagem/${equipamentoSelecionado.id}/cancelar`);

      await Promise.all([carregarFila(), carregarEmAndamento()]);

      setEquipamentoSelecionado(null);
      setChecklist([]);
      setLaudo('');
      setDestino('');
      setActiveTab('fila');
    } catch (error) {
      console.error('Erro ao voltar para fila:', error);
      alert('Erro ao devolver o equipamento para a fila. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const limparTodoHistorico = async () => {
    if (!confirm("Tem certeza de que deseja limpar TODO o histórico de triagens finalizadas? Esta ação não pode ser desfeita.")) {
      return;
    }
    setLoading(true);
    try {
      await api.delete('/Triagem/finalizados');
      alert('Histórico de triagens finalizadas limpo com sucesso!');
      setEquipamentoSelecionado(null);
      await carregarFinalizados();
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
      alert('Falha ao limpar histórico. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  };

  const excluirHistoricoItem = async (equipamentoId: number | string) => {
    if (!confirm("Deseja realmente excluir o histórico de triagem deste equipamento?")) {
      return;
    }
    setLoading(true);
    try {
      await api.delete(`/Triagem/finalizados/${equipamentoId}`);
      alert('Histórico do equipamento excluído!');
      if (equipamentoSelecionado?.id === equipamentoId) {
        setEquipamentoSelecionado(null);
      }
      await carregarFinalizados();
    } catch (error) {
      console.error('Erro ao excluir histórico do equipamento:', error);
      alert('Falha ao excluir histórico. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  };

  const finalizarTriagem = async () => {
    if (!equipamentoSelecionado || !destino) {
      alert('Selecione um destino para o equipamento.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/Triagem', {
        equipamentoId: equipamentoSelecionado.id,
        checklist: checklist,
        laudoTecnico: laudo,
        destino: destino
      });

      alert('Triagem finalizada com sucesso!');

      // Recarrega as listas do backend para persistência (Finalizados agora vem do histórico de triagens)
      await Promise.all([carregarEmAndamento(), carregarFinalizados()]);

      setEquipamentoSelecionado(null);
      setChecklist([]);
      setLaudo('');
      setDestino('');
      setActiveTab('finalizados');

    } catch (error) {
      console.error('Erro ao salvar triagem:', error);
      alert('Erro ao salvar a triagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const checklistItens = [
    'Diagnóstico de Hardware',
    'Sanitização de Dados (Wipe)',
    'Inspeção Estética/Física'
  ];

  // Filtragem baseada na aba ativa (garante unicidade)
  const getCurrentList = () => {
    let list: Equipamento[] = [];
    if (activeTab === 'fila') list = fila;
    else if (activeTab === 'andamento') list = emAndamento;
    else list = finalizados;

    // Remove duplicatas por ID
    return list.filter((eq, index, self) => 
      index === self.findIndex(e => e.id === eq.id)
    );
  };

  const currentList = getCurrentList();

  return (
    <div className="bg-[#f3faff] text-[#071e27] min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <Sidebar 
        userType="internal" 
        userName={currentUserName} 
        userRole={currentUserRole} 
        userPhoto={currentUserPhoto}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header title="Controle de Triagem" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 pb-12">
          
          {/* Tabs */}
          <section className="flex bg-surface-container-low p-1.5 rounded-2xl w-fit shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('fila')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'fila' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
            >
              Fila de Espera ({fila.length})
            </button>
            <button 
              onClick={() => setActiveTab('andamento')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'andamento' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
            >
              Em Andamento ({emAndamento.length})
            </button>
            <button 
              onClick={() => setActiveTab('finalizados')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'finalizados' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-primary'}`}
            >
              Finalizados ({finalizados.length})
            </button>
           </section>

           {/* Formulário de Triagem - AGORA POSICIONADO ACIMA DOS CARDS (conforme solicitado) */}
           {equipamentoSelecionado && (
             <section className="space-y-6">
               <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-2xl font-black text-on-surface tracking-tight">
                     {activeTab === 'fila' ? 'Informações do Equipamento' : 'Equipamento em Análise'}
                   </h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                     {activeTab === 'fila' ? 'Fila de Espera' : 'Sessão iniciada agora'}
                   </p>
                 </div>
                 <button onClick={() => setEquipamentoSelecionado(null)} className="text-sm text-gray-500 hover:text-red-600">Fechar</button>
               </div>

               <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_12_32px_rgba(7,30,39,0.06)] border border-gray-100 space-y-10">
                 
                 <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-gray-100">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center shadow-inner">
                       <span className="material-symbols-outlined text-3xl">laptop_mac</span>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Patrimônio G.S.E.I.</p>
                       <h3 className="text-3xl font-black text-on-surface">{equipamentoSelecionado.codigo}</h3>
                       <p className="text-sm font-medium text-on-surface-variant">{equipamentoSelecionado.modelo}</p>
                     </div>
                   </div>
                 </div>

                 {/* Formulário completo apenas em Em Andamento */}
                 {activeTab === 'andamento' && (
                   <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">fact_check</span>
                           Checklist de Entrada
                         </h4>
                         <div className="space-y-3">
                           {checklistItens.map((item) => (
                             <ChecklistItem
                               key={item}
                               label={item}
                               checked={checklist.includes(item)}
                               onToggle={() => toggleChecklist(item)}
                             />
                           ))}
                         </div>
                       </div>

                       <div className="space-y-4">
                         <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">edit_note</span>
                           Laudo Técnico
                         </h4>
                         <textarea 
                           value={laudo}
                           onChange={(e) => setLaudo(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition placeholder:text-gray-400" 
                           rows={6} 
                           placeholder="Descreva aqui eventuais defeitos, peças faltantes ou observações..."
                         />
                       </div>
                     </div>

                     <div className="space-y-6 pt-4">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-center text-gray-400">Destino do Equipamento</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <DestinationOption
                           value="Reuso"
                           icon="settings_backup_restore"
                           label="Reuso"
                           description="Aprovado para retornar ao inventário ativo."
                           selected={destino === 'Reuso'}
                           onSelect={setDestino}
                         />
                         <DestinationOption
                           value="Doacao"
                           icon="volunteer_activism"
                           label="Doação"
                           description="Funcional, mas obsoleto para uso interno."
                           selected={destino === 'Doacao'}
                           onSelect={setDestino}
                         />
                         <DestinationOption
                           value="Descarte"
                           icon="delete_forever"
                           label="Descarte"
                           description="Inoperante ou perigoso."
                           selected={destino === 'Descarte'}
                           onSelect={setDestino}
                         />
                       </div>
                     </div>

                      <button 
                        onClick={finalizarTriagem}
                        disabled={loading || !destino}
                        className="w-full text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#28782E' }}
                      >
                        {loading ? 'Salvando...' : 'Finalizar e Salvar Triagem'}
                      </button>

                      <button 
                        onClick={voltarParaFila}
                        disabled={loading}
                        className="w-full py-4 rounded-[20px] font-black text-sm uppercase tracking-widest border border-gray-300 text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all mt-3"
                      >
                        Voltar para Fila de Espera
                      </button>
                   </>
                 )}

                 {/* Opção de destino na Fila: Enviar para Em Andamento */}
                 {activeTab === 'fila' && (
                   <div className="space-y-6 pt-4">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-center text-gray-400">Destinatário do Equipamento</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <DestinationOption
                         value="EmAndamento"
                         icon="pending_actions"
                         label="Em Andamento"
                         description="Enviar para triagem técnica."
                         selected={destino === 'EmAndamento'}
                         onSelect={setDestino}
                       />
                     </div>
                     <div className="flex flex-col md:flex-row gap-4">
                       <button 
                         onClick={enviarParaAndamento}
                         disabled={!destino}
                         className="flex-1 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                         style={{ backgroundColor: '#28782E' }}
                       >
                         Enviar para Em Andamento
                       </button>
                       <button 
                         onClick={() => setEquipamentoSelecionado(null)}
                         className="flex-1 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest border border-gray-300 text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
                       >
                         Cancelar
                       </button>
                     </div>
                   </div>
                 )}

                  {/* Visualização em Finalizados - Histórico completo de laudos */}
                  {activeTab === 'finalizados' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Histórico completo de triagens realizadas neste equipamento</p>
                      </div>

                      {historicoTriagens.length > 0 ? (
                        <div className="space-y-4">
                          {historicoTriagens.map((registro, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                    {new Date(registro.dataTriagem).toLocaleString('pt-BR', {
                                      day: '2-digit', month: '2-digit', year: 'numeric',
                                      hour: '2-digit', minute: '2-digit'
                                    })}
                                  </span>
                                  <div className="text-sm font-semibold text-on-surface mt-1">
                                    Técnico: <span className="text-primary">{registro.tecnicoResponsavel}</span>
                                  </div>
                                </div>
                                <span className="px-3 py-1 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">
                                  {registro.destino}
                                </span>
                              </div>

                              {registro.checklist && registro.checklist.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Checklist realizado:</p>
                                  <ul className="text-sm text-gray-700 list-disc list-inside">
                                    {registro.checklist.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {registro.laudoTecnico && (
                                <div>
                                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Laudo Técnico:</p>
                                  <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-xl border">
                                    {registro.laudoTecnico}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4">Nenhum registro de triagem encontrado para este equipamento.</p>
                      )}
                    </div>
                  )}
               </div>
             </section>
             )}

             {/* Lista de Equipamentos */}
             <section>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">
                   {activeTab === 'fila' && 'Equipamentos na Fila'}
                   {activeTab === 'andamento' && 'Triagens em Andamento'}
                   {activeTab === 'finalizados' && 'Triagens Finalizadas'}
                 </h3>
                 {activeTab === 'finalizados' && currentUserRole === 'Administrador' && finalizados.length > 0 && (
                   <button
                     onClick={limparTodoHistorico}
                     className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition-colors"
                   >
                     <span className="material-symbols-outlined text-sm">delete_sweep</span>
                     Limpar Todo o Histórico
                   </button>
                 )}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentList.length > 0 ? currentList.map((item) => {
                   const isSelected = equipamentoSelecionado?.id === item.id;
                   return (
                     <div 
                       key={item.id} 
                       onClick={() => selecionarEquipamento(item)}
                       className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md
                         ${isSelected 
                           ? 'border-primary bg-primary/5 shadow-md' 
                           : 'bg-white border-gray-100'}`}
                     >
                       <div className="flex justify-between items-center">
                         <div>
                           <h4 className="font-bold text-on-surface">{item.codigo}</h4>
                           <p className="text-sm text-gray-600">{item.modelo}</p>
                         </div>
                         <div className="flex items-center gap-2">
                           {isSelected && (
                             <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-full">
                               Selecionado
                             </span>
                           )}
                           {activeTab === 'finalizados' && currentUserRole === 'Administrador' && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 excluirHistoricoItem(item.id);
                               }}
                               className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                               title="Excluir histórico deste equipamento"
                             >
                               <span className="material-symbols-outlined text-base">delete</span>
                             </button>
                           )}
                         </div>
                       </div>
                     </div>
                   );
                 }) : (
                   <p className="text-gray-500 col-span-2">Nenhum equipamento nesta seção.</p>
                 )}
               </div>
             </section>

         </main>
      </div>
    </div>
  );
}
