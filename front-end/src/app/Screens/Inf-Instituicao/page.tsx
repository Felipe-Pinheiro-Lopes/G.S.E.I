'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { mascaraCNPJ, mascaraTelefone } from '@/utils/masks';

interface Instituicao {
  id: number;
  nome: string;
  cnpj: string;
  responsavel: string;
  telefone: string;
  email: string;
  dataCadastro: string;
}

export default function InfInstituicaoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto, instituicaoId } = useCurrentUser();

  const [instituicao, setInstituicao] = useState<Instituicao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form fields
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchInstituicao = async () => {
      if (!instituicaoId) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<Instituicao>(`/Instituicoes/${instituicaoId}`);
        const data = res.data;
        setInstituicao(data);
        setNome(data.nome);
        setCnpj(data.cnpj);
        setResponsavel(data.responsavel);
        setTelefone(data.telefone);
        setEmail(data.email);
      } catch (e) {
        console.error('Erro ao carregar dados da instituição:', e);
        setError('Não foi possível carregar os dados da instituição.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstituicao();
  }, [instituicaoId]);

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);

    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/Instituicoes/${instituicaoId}`, {
        nome: nome.trim(),
        cnpj: cnpj.trim(),
        responsavel: responsavel.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
      });

      setSuccessMsg('Dados atualizados com sucesso!');
      setEditMode(false);

      // Refresh data
      const res = await api.get<Instituicao>(`/Instituicoes/${instituicaoId}`);
      setInstituicao(res.data);
    } catch (e) {
      console.error('Erro ao salvar:', e);
      setError('Falha ao salvar alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (instituicao) {
      setNome(instituicao.nome);
      setCnpj(instituicao.cnpj);
      setResponsavel(instituicao.responsavel);
      setTelefone(instituicao.telefone);
      setEmail(instituicao.email);
    }
    setEditMode(false);
    setError(null);
    setSuccessMsg(null);
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
        <Header title="Dados da Instituição" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#071e27] tracking-tight">Informações da Instituição</h2>
            <p className="text-sm text-gray-600 mt-1">Gerencie os dados cadastrais da sua organização.</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center text-gray-500">
              Carregando dados da instituição...
            </div>
          ) : !instituicaoId ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-3 block">domain_disabled</span>
              <p className="text-gray-500 text-lg font-bold">Nenhuma instituição vinculada</p>
              <p className="text-gray-400 text-sm mt-1">Sua conta não está vinculada a uma instituição parceira.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-bold px-4 py-3 rounded-2xl">
                  {successMsg}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0d631b]/10 text-[#0d631b] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">domain</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instituição Parceira</p>
                    <p className="text-lg font-black text-[#071e27]">{instituicao?.nome}</p>
                  </div>
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nome / Razão Social</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={!editMode}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm transition ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-[#0d631b] focus:outline-none bg-white text-[#0a0a0a]' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">CNPJ</label>
                    <input
                      value={cnpj}
                      onChange={(e) => setCnpj(mascaraCNPJ(e.target.value))}
                      disabled={!editMode}
                      maxLength={18}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono transition ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-[#0d631b] focus:outline-none bg-white text-[#0a0a0a]' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Responsável</label>
                    <input
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm transition ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-[#0d631b] focus:outline-none bg-white text-[#0a0a0a]' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Telefone</label>
                    <input
                      value={telefone}
                      onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                      disabled={!editMode}
                      maxLength={15}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm font-mono transition ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-[#0d631b] focus:outline-none bg-white text-[#0a0a0a]' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 border rounded-2xl text-sm transition ${editMode ? 'border-gray-300 focus:ring-2 focus:ring-[#0d631b] focus:outline-none bg-white text-[#0a0a0a]' : 'border-transparent bg-gray-50 text-gray-800 cursor-default'}`}
                    />
                  </div>
                </div>

                {instituicao?.dataCadastro && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-400">
                      Cadastrada em: {new Date(instituicao.dataCadastro).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white font-bold text-sm rounded-2xl shadow-md hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
