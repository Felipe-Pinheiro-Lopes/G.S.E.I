'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { api, listFromResponse } from '@/services/api';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface UserRow {
  id: number;
  nome: string;
  email: string;
  role: string;
  instituicaoId?: number;
}

interface Instituicao {
  id: number;
  nome: string;
}

export default function UsuariosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { name: currentUserName, role: currentUserRole, photo: currentUserPhoto } = useCurrentUser();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nome: '',
    email: '',
    senha: '',
    role: 'Internal',
    instituicaoId: '' as string,
  });

  const fetchData = async () => {
    try {
      const [usersRes, instRes] = await Promise.all([
        api.get('/Users'),
        api.get('/Instituicoes'),
      ]);
      const usersList = listFromResponse<any>(usersRes.data).map((u: any) => ({
        id: u.id,
        nome: u.nome,
        email: u.email,
        role: u.role,
        instituicaoId: u.instituicaoId,
      }));
      setUsers(usersList);
      const instList = listFromResponse<any>(instRes.data).map((i: any) => ({
        id: i.id,
        nome: i.nome,
      }));
      setInstituicoes(instList);
    } catch (e) {
      console.error('Erro ao carregar usuários:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setFormData({ id: 0, nome: '', email: '', senha: '', role: 'Internal', instituicaoId: '' });
    setModalMode('create');
    setShowModal(true);
  };

  const openEdit = (user: UserRow) => {
    setFormData({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: '',
      role: user.role,
      instituicaoId: user.instituicaoId?.toString() || '',
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim() || !formData.email.trim()) {
      alert('Nome e Email são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      if (modalMode === 'create') {
        if (!formData.senha.trim()) {
          alert('Senha é obrigatória para novo usuário.');
          setSaving(false);
          return;
        }
        await api.post('/Auth/register', {
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          senha: formData.senha,
          role: formData.role,
          instituicaoId: formData.instituicaoId ? parseInt(formData.instituicaoId) : null,
        });
        alert('Usuário criado com sucesso!');
      } else {
        const payload: any = {
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          role: formData.role,
          instituicaoId: formData.instituicaoId ? parseInt(formData.instituicaoId) : null,
        };
        if (formData.senha.trim()) {
          payload.novaSenha = formData.senha;
        }
        await api.put(`/Users/${formData.id}`, payload);
        alert('Usuário atualizado com sucesso!');
      }
      setShowModal(false);
      await fetchData();
    } catch (e) {
      console.error('Erro ao salvar usuário:', e);
      alert('Falha ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.delete(`/Users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (e) {
      console.error('Erro ao excluir:', e);
      alert('Falha ao excluir. Tente novamente.');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700';
      case 'Internal': return 'bg-blue-100 text-blue-700';
      case 'Institution': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'Admin': return 'Administrador';
      case 'Internal': return 'Interno';
      case 'Institution': return 'Instituição';
      default: return role;
    }
  };

  const filtered = users.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
        <Header title="Gerenciamento de Usuários" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#071e27]">Usuários do Sistema</h2>
              <p className="text-gray-600 text-sm">Gerencie contas e permissões de acesso</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded-xl w-72 text-[#071e27] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.985] transition-all"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                Novo Usuário
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando usuários...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 font-bold uppercase tracking-widest text-xs">
                      <th className="py-3 px-4 hidden sm:table-cell">ID</th>
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4 hidden md:table-cell">Email</th>
                      <th className="py-3 px-4">Permissão</th>
                      <th className="py-3 px-4 hidden md:table-cell">Instituição</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? filtered.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 text-gray-500 font-mono text-xs hidden sm:table-cell">#{user.id}</td>
                        <td className="py-4 px-4 font-bold text-[#071e27]">{user.nome}</td>
                        <td className="py-4 px-4 text-gray-600 hidden md:table-cell">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleBadge(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm hidden md:table-cell">
                          {user.instituicaoId
                            ? instituicoes.find(i => i.id === user.instituicaoId)?.nome || `ID: ${user.instituicaoId}`
                            : '—'}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhum usuário encontrado.
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

      {/* Modal Criar/Editar Usuário */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/80">
              <div>
                <h3 className="text-xl font-black text-[#071e27]">
                  {modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {modalMode === 'create' ? 'Preencha os dados para cadastrar' : 'Atualize os dados do usuário'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1.5">NOME *</label>
                <input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1.5">EMAIL *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1.5">
                  {modalMode === 'create' ? 'SENHA *' : 'NOVA SENHA (deixe em branco para manter)'}
                </label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  placeholder={modalMode === 'create' ? 'Senha segura' : 'Nova senha (opcional)'}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">PERMISSÃO</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  >
                    <option value="Admin">Administrador</option>
                    <option value="Internal">Interno</option>
                    <option value="Institution">Instituição</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333] mb-1.5">INSTITUIÇÃO VINCULADA</label>
                  <select
                    value={formData.instituicaoId}
                    onChange={(e) => setFormData({ ...formData, instituicaoId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b] text-[#0a0a0a]"
                  >
                    <option value="">Nenhuma</option>
                    {instituicoes.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#0d631b] to-[#2e7d32] text-white font-bold text-sm rounded-2xl shadow-md hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
              >
                {saving ? 'Salvando...' : modalMode === 'create' ? 'Cadastrar Usuário' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
