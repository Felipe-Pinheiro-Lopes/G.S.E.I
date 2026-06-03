'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AcompanhamentoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="bg-[#f3faff] min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <Sidebar userType="institution" userName="Assoc. Filantrópica" userRole="ID: 98231" />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header title="Minhas Solicitações" onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-black mb-6">Acompanhamento de Solicitações</h2>
            <p className="text-gray-500">Visualize o status das suas requisições de doação.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
