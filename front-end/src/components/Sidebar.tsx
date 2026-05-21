'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { destroyCookie, setCookie } from 'nookies';
import React, { useState } from 'react';
import { api } from '@/services/api';
import { parseCookies } from 'nookies';

interface SidebarProps {
  userType?: 'internal' | 'institution';
  userName?: string;
  userRole?: string;
  userPhoto?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ 
  userType = 'internal', 
  userName = 'Usuário', 
  userRole = 'Administrador',
  userPhoto,
  mobileOpen = true,
  onMobileClose
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isInternal = userType === 'internal';

  // Profile Edit Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userName || '',
    photo: userPhoto || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  function handleLogout() {
    // Remove todos os cookies de autenticação
    destroyCookie(null, 'gesi.token', { path: '/' });
    destroyCookie(null, 'gesi.userName', { path: '/' });
    destroyCookie(null, 'gesi.role', { path: '/' });
    destroyCookie(null, 'gesi.userPhoto', { path: '/' });
    destroyCookie(null, 'gesi.instituicaoId', { path: '/' });

    // Redireciona para a página de login correta
    router.replace('/login');
  }

  return (
    <aside className={`fixed top-0 left-0 w-64 h-full bg-[#f8fbff] z-[70] border-r border-gray-200 flex flex-col shadow-xl lg:shadow-none transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-6 pb-8 flex justify-between items-center">
        <div>
          <h2 className="font-black text-2xl text-green-800 tracking-tight">G.S.E.I.</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            {isInternal ? 'Gestão de TI' : 'Portal Institucional'}
          </p>
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="material-symbols-outlined text-gray-500 hover:text-red-500 lg:hidden">close</button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {isInternal ? (
          <>
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Principal</p>
            <Link 
              href="/Screens/Dashboard" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive('/Screens/Dashboard') ? 'bg-[#e6eeff] text-[#1a56db]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive('/Screens/Dashboard') ? 'filled-icon' : ''}`}>grid_view</span>
              <span className={`font-semibold text-sm ${isActive('/Screens/Dashboard') ? 'font-bold' : ''}`}>Dashboard</span>
            </Link>
            <Link 
              href="/Screens/Inventario" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive('/Screens/Inventario') ? 'bg-[#e6eeff] text-[#1a56db]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive('/Screens/Inventario') ? 'filled-icon' : ''}`}>inventory_2</span>
              <span className={`font-semibold text-sm ${isActive('/Screens/Inventario') ? 'font-bold' : ''}`}>Inventário</span>
            </Link>

            <p className="px-4 py-2 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processos</p>
            <Link 
              href="/Screens/Triagem" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive('/Screens/Triagem') ? 'bg-[#e6eeff] text-[#1a56db]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive('/Screens/Triagem') ? 'filled-icon' : ''}`}>fact_check</span>
              <span className={`font-semibold text-sm ${isActive('/Screens/Triagem') ? 'font-bold' : ''}`}>Triagem</span>
            </Link>
            <Link 
              href="/Screens/Doacoes" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive('/Screens/Doacoes') ? 'bg-[#e6eeff] text-[#1a56db]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive('/Screens/Doacoes') ? 'filled-icon' : ''}`}>volunteer_activism</span>
              <span className={`font-semibold text-sm ${isActive('/Screens/Doacoes') ? 'font-bold' : ''}`}>Doações</span>
            </Link>
            <Link 
              href="/Screens/Descarte" 
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${isActive('/Screens/Descarte') ? 'bg-[#e6eeff] text-[#1a56db]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'}`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive('/Screens/Descarte') ? 'filled-icon' : ''}`}>delete_forever</span>
              <span className={`font-semibold text-sm ${isActive('/Screens/Descarte') ? 'font-bold' : ''}`}>Descarte</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/Screens/Solicitacao" className="flex items-center gap-4 px-4 py-3 bg-green-800 text-white rounded-lg shadow-md transition-colors">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
              <span className="font-bold text-sm">Nova Solicitação</span>
            </Link>
            <Link href="/Screens/AcompanhamentoSolicitacao" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[22px]">assignment</span>
              <span className="font-semibold text-sm">Minhas Solicitações</span>
            </Link>
            <Link href="/Screens/Inf-Instituicao" className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
              <span className="font-semibold text-sm">Dados da Instituição</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto bg-white/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img 
            src={userPhoto || "https://i.pravatar.cc/150?img=11"} 
            alt={userName}
            suppressHydrationWarning
            onClick={() => {
              setProfileData({
                name: userName || '',
                photo: userPhoto || '',
                newPassword: '',
                confirmPassword: ''
              });
              setProfileMessage('');
              setShowProfileModal(true);
            }}
            className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer hover:ring-2 hover:ring-[#0d631b] transition-all"
            title="Clique para editar seu perfil"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate" suppressHydrationWarning>{userName}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider truncate" suppressHydrationWarning>{userRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-bold text-sm">Sair do Sistema</span>
        </button>
      </div>

      {/* Modal de Edição de Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-[#071e27]">Editar Perfil</h3>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={profileData.photo || "https://i.pravatar.cc/150?img=11"} 
                    alt="Foto de perfil" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <label className="absolute -bottom-1 -right-1 bg-[#0d631b] text-white rounded-full p-1.5 cursor-pointer hover:bg-green-800 transition">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const base64 = ev.target?.result as string;
                            setProfileData(prev => ({ ...prev, photo: base64 }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Clique na câmera para alterar a foto</p>
              </div>

              {/* Nome */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">NOME COMPLETO</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0d631b]" 
                />
              </div>

              {/* Email - somente leitura */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">E-MAIL (não pode ser alterado)</label>
                <input 
                  type="email" 
                  value={parseCookies()['gesi.email'] || 'seu@email.com'} 
                  disabled 
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-2xl text-gray-500 cursor-not-allowed" 
                />
              </div>

              {/* Trocar Senha */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">NOVA SENHA (deixe em branco para manter a atual)</label>
                <input 
                  type="password" 
                  placeholder="Nova senha" 
                  value={profileData.newPassword}
                  onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0d631b] mb-3" 
                />
                <input 
                  type="password" 
                  placeholder="Confirmar nova senha" 
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0d631b]" 
                />
              </div>

              {profileMessage && (
                <p className="text-sm text-center text-green-600 font-medium">{profileMessage}</p>
              )}
            </div>

            <div className="p-5 bg-gray-50 flex gap-3 justify-end">
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-2xl transition"
              >
                Cancelar
              </button>
              <button 
                disabled={savingProfile}
                onClick={async () => {
                  if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
                    setProfileMessage("As senhas não coincidem.");
                    return;
                  }

                  setSavingProfile(true);
                  setProfileMessage('');

                  try {
                    const cookies = parseCookies();
                    const userId = cookies['gesi.userId'] ? parseInt(cookies['gesi.userId']) : undefined;

                    if (!userId) {
                      // Fallback: atualiza apenas localmente via cookies
                      setCookie(null, 'gesi.userName', profileData.name, { path: '/' });
                      if (profileData.photo) setCookie(null, 'gesi.userPhoto', profileData.photo, { path: '/' });
                      setProfileMessage("Perfil atualizado localmente (login com ID necessário para backend completo).");
                      setTimeout(() => setShowProfileModal(false), 1500);
                      return;
                    }

                    const payload: any = {
                      Nome: profileData.name,
                    };

                    if (profileData.photo) {
                      payload.FotoUrl = profileData.photo;
                    }

                    if (profileData.newPassword) {
                      payload.NovaSenha = profileData.newPassword;
                    }

                    await api.put(`/Users/${userId}`, payload);

                    // Atualiza cookies para refletir imediatamente
                    setCookie(null, 'gesi.userName', profileData.name, { path: '/' });
                    if (profileData.photo) {
                      setCookie(null, 'gesi.userPhoto', profileData.photo, { path: '/' });
                    }

                    setProfileMessage("Perfil atualizado com sucesso!");
                    
                    // Fecha o modal após 1.2s
                    setTimeout(() => {
                      setShowProfileModal(false);
                      window.location.reload(); // força atualização da UI
                    }, 1200);

                  } catch (error) {
                    console.error("Erro ao salvar perfil:", error);
                    setProfileMessage("Erro ao salvar. Tente novamente.");
                  } finally {
                    setSavingProfile(false);
                  }
                }}
                className="px-6 py-2.5 bg-[#0d631b] hover:bg-green-800 text-white font-bold rounded-2xl text-sm disabled:opacity-60"
              >
                {savingProfile ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

