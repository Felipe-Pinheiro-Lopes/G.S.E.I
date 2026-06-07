'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { api } from '@/services/api';
import { listFromResponse } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Equipamento {
  id: number;
  codigo: string;
  modelo: string;
  especificacoes: string;
  status: string;
  lote: string;
  tipo?: string;
}

export default function InventarioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showNovoModal, setShowNovoModal] = useState(false);
  const [novoEquip, setNovoEquip] = useState({ codigo: '', modelo: '', especificacoes: '', lote: '', tipo: 'Notebook' as string });
  const [salvandoNovo, setSalvandoNovo] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEquip, setEditEquip] = useState<{ id: number; codigo: string; modelo: string; especificacoes: string; lote: string; tipo: string } | null>(null);
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  const fetchEquipamentos = async (status?: string) => {
    try {
      const params = status ? { status } : {};
      const res = await api.get<Equipamento[]>('/Equipamentos', { params });
      setEquipamentos(listFromResponse<Equipamento>(res.data));
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      setEquipamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipamentos(statusFilter || undefined);
  }, [statusFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get('status');
      if (statusParam) {
        setStatusFilter(statusParam);
      }
    }
  }, []);

  const activeStatuses = ['EmEstoque', 'EmTriagem', 'EmAnalise', 'AguardandoFormatacao'];
  const baseList = statusFilter
    ? equipamentos
    : equipamentos.filter((eq) => activeStatuses.includes(eq.status) || !eq.status);

  const filtered = baseList.filter(
    (eq) =>
      eq.codigo.toLowerCase().includes(search.toLowerCase()) ||
      eq.modelo.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnviarParaTriagem = async (equipamento: Equipamento) => {
    try {
      await api.post('/Triagem/iniciar', {
        equipamentoId: equipamento.id,
        tecnicoResponsavel: currentUserName || 'Técnico',
      });
      await fetchEquipamentos(statusFilter || undefined);
      alert('Equipamento enviado para triagem!');
    } catch (error) {
      console.error('Erro ao enviar para triagem:', error);
      alert('Erro ao enviar para triagem. Tente novamente.');
    }
  };

  return (
    <div className="bg-[#f3faff] min-h-screen">
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
        <Header title="Inventário" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#071e27]">Inventário</h2>
              <p className="text-gray-600">Equipamentos disponíveis no sistema</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por código ou modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded-xl w-72 text-[#071e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded-xl bg-white text-[#071e27] focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Todos os status</option>
                <option value="EmEstoque">Em Estoque</option>
                <option value="EmTriagem">Em Triagem</option>
                <option value="EmAnalise">Em Análise (Triagem)</option>
                <option value="DoacaoAprovada">Doação Aprovada</option>
                <option value="Descartado">Descartado</option>
              </select>

              <Button
                onClick={() => {
                  setNovoEquip({ codigo: '', modelo: '', especificacoes: '', lote: '', tipo: 'Notebook' });
                  setShowNovoModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.985] transition-all"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                Novo Equipamento
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando inventário...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-800 font-bold uppercase tracking-widest text-xs">
                      <th className="py-3 px-4">Código</th>
                      <th className="py-3 px-4">Modelo</th>
                      <th className="py-3 px-4 hidden md:table-cell">Especificações</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Tipo</th>
                      <th className="py-3 px-4 hidden md:table-cell">Lote</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map((eq) => (
                        <tr key={eq.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 font-mono text-sm text-blue-700 font-bold">{eq.codigo}</td>
                          <td className="py-4 px-4 font-bold text-[#071e27] text-base">{eq.modelo}</td>
                          <td className="py-4 px-4 text-gray-600 text-xs max-w-xs truncate hidden md:table-cell">{eq.especificacoes}</td>
                          <td className="py-4 px-4 hidden sm:table-cell">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {eq.tipo || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500 hidden md:table-cell">{eq.lote}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                                eq.status === 'EmEstoque'
                                  ? 'bg-green-100 text-green-700'
                                  : eq.status === 'EmTriagem'
                                    ? 'bg-orange-100 text-orange-700'
                                    : eq.status === 'EmAnalise'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : eq.status === 'DoacaoAprovada'
                                        ? 'bg-blue-100 text-blue-700'
                                        : eq.status === 'Descartado'
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {eq.status === 'EmEstoque'
                                ? 'Em Estoque'
                                : eq.status === 'EmTriagem'
                                  ? 'Em Triagem'
                                  : eq.status === 'EmAnalise'
                                    ? 'Em Análise (Triagem)'
                                    : eq.status === 'DoacaoAprovada'
                                      ? 'Doação Aprovada'
                                      : eq.status === 'Descartado'
                                        ? 'Descartado'
                                        : 'Aguardando Formatação'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditEquip({
                                  id: eq.id,
                                  codigo: eq.codigo,
                                  modelo: eq.modelo,
                                  especificacoes: eq.especificacoes,
                                  lote: eq.lote,
                                  tipo: eq.tipo || 'Notebook',
                                });
                                setShowEditModal(true);
                              }}
                              className="px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>
                              Editar
                            </button>
                        <Button
                          onClick={() => handleEnviarParaTriagem(eq)}
                          className="px-3 py-2 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors"
                        >
                          Enviar para Triagem
                        </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhum equipamento encontrado.
                      </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showNovoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="text-xl font-black text-[#071e27]">Cadastrar Novo Equipamento</h3>
                <p className="text-xs text-gray-500 mt-0.5">Preencha os dados do dispositivo</p>
              </div>
              <button
                onClick={() => setShowNovoModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">CÓDIGO</label>
                  <input
                    value={novoEquip.codigo}
                    onChange={(e) => setNovoEquip({ ...novoEquip, codigo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    placeholder="EQ-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">MODELO *</label>
                  <input
                    value={novoEquip.modelo}
                    onChange={(e) => setNovoEquip({ ...novoEquip, modelo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    placeholder="Notebook Dell G15"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">ESPECIFICAÇÕES</label>
                  <textarea
                    value={novoEquip.especificacoes}
                    onChange={(e) => setNovoEquip({ ...novoEquip, especificacoes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    placeholder="Intel i5 10ª, 16GB RAM, 512GB SSD"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">TIPO</label>
                    <select
                      value={novoEquip.tipo}
                      onChange={(e) => setNovoEquip({ ...novoEquip, tipo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    >
                      <option value="Notebook">Notebook</option>
                      <option value="Computador">Computador / Desktop</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Periférico">Periférico</option>
                      <option value="Peças">Peças / Componentes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">LOTE</label>
                    <input
                      value={novoEquip.lote}
                      onChange={(e) => setNovoEquip({ ...novoEquip, lote: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                      placeholder="Lote-YYYY-MM"
                    />
                  </div>
                </div>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowNovoModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!novoEquip.modelo.trim()) {
                    alert('Modelo é obrigatório.');
                    return;
                  }

                  setSalvandoNovo(true);
                  try {
                    const payload = {
                      codigo: novoEquip.codigo.trim(),
                      modelo: novoEquip.modelo.trim(),
                      especificacoes: novoEquip.especificacoes.trim(),
                      lote: novoEquip.lote.trim(),
                      tipo: novoEquip.tipo,
                      status: 'EmEstoque',
                    };

                    const res = await api.post('/Equipamentos', payload);
                    setEquipamentos((prev) => [res.data, ...prev]);
                    setShowNovoModal(false);
                    alert('Equipamento cadastrado com sucesso!');
                  } catch (error) {
                    console.error('Erro ao cadastrar equipamento:', error);
                    alert('Falha ao cadastrar. Tente novamente.');
                  } finally {
                    setSalvandoNovo(false);
                  }
                }}
                disabled={salvandoNovo}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white font-bold text-sm rounded-2xl shadow-md hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              >
                {salvandoNovo ? 'Salvando...' : 'Cadastrar Equipamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Equipamento */}
      {showEditModal && editEquip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="text-xl font-black text-[#071e27]">Editar Equipamento</h3>
                <p className="text-xs text-gray-500 mt-0.5">Atualize os dados do dispositivo</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">CÓDIGO</label>
                  <input
                    value={editEquip.codigo}
                    onChange={(e) => setEditEquip({ ...editEquip, codigo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">MODELO *</label>
                  <input
                    value={editEquip.modelo}
                    onChange={(e) => setEditEquip({ ...editEquip, modelo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">ESPECIFICAÇÕES</label>
                  <textarea
                    value={editEquip.especificacoes}
                    onChange={(e) => setEditEquip({ ...editEquip, especificacoes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">TIPO</label>
                    <select
                      value={editEquip.tipo}
                      onChange={(e) => setEditEquip({ ...editEquip, tipo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    >
                      <option value="Notebook">Notebook</option>
                      <option value="Computador">Computador / Desktop</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Periférico">Periférico</option>
                      <option value="Peças">Peças / Componentes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1.5">LOTE</label>
                    <input
                      value={editEquip.lote}
                      onChange={(e) => setEditEquip({ ...editEquip, lote: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                    />
                  </div>
                </div>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!editEquip.modelo.trim()) {
                    alert('Modelo é obrigatório.');
                    return;
                  }

                  setSalvandoEdit(true);
                  try {
                    await api.put(`/Equipamentos/${editEquip.id}`, {
                      codigo: editEquip.codigo.trim(),
                      modelo: editEquip.modelo.trim(),
                      especificacoes: editEquip.especificacoes.trim(),
                      lote: editEquip.lote.trim(),
                      tipo: editEquip.tipo,
                    });
                    setShowEditModal(false);
                    alert('Equipamento atualizado com sucesso!');
                    await fetchEquipamentos(statusFilter || undefined);
                  } catch (error) {
                    console.error('Erro ao atualizar equipamento:', error);
                    alert('Falha ao atualizar. Tente novamente.');
                  } finally {
                    setSalvandoEdit(false);
                  }
                }}
                disabled={salvandoEdit}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white font-bold text-sm rounded-2xl shadow-md hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              >
                {salvandoEdit ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
