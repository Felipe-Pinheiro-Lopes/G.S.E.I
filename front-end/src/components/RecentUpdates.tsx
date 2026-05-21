'use client';

import React from 'react';

interface AtualizacaoItem {
  titulo: string;
  subtitulo: string;
  tempo: string;
  icone: string;
}

interface RecentUpdatesProps {
  items: AtualizacaoItem[];
  onLogCompleto?: () => void;
}

export default function RecentUpdates({ items, onLogCompleto }: RecentUpdatesProps) {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-[0_12_32px_rgba(7,30,39,0.06)]">
      <h4 className="text-xl font-bold text-[#071e27] mb-8">Últimas Atualizações</h4>
      <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
        {items.length > 0 ? items.map((item, index) => (
          <div 
            key={index} 
            className="timeline-item relative pl-10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="absolute left-0 top-0 w-7 h-7 bg-[#a3f69c] text-[#005312] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] filled-icon">{item.icone}</span>
            </span>
            <p className="text-sm font-bold text-[#071e27]">{item.titulo}</p>
            <p className="text-xs text-gray-600">{item.subtitulo}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase">{item.tempo}</p>
          </div>
        )) : <p className="text-gray-400">Nenhuma atualização recente.</p>}
        
        <a href="#log1" className="block w-full mt-8" onClick={(e) => { if (onLogCompleto) { e.preventDefault(); onLogCompleto(); } }}>
          <button className="w-full py-3 bg-[#e6f6ff] text-[#0d631b] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#dbf1fe] transition-colors">
            Log completo
          </button>
        </a>
      </div>
    </div>
  );
}
