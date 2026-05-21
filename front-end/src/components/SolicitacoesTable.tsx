'use client';

import React, { useState } from 'react';

export interface SolicitacaoRow {
  id: number | string;
  instituicao: string;
  cnpj: string;
  itens: string;           // e.g. "15 Equipamentos"
  itensDetalhe?: string;   // "Notebooks, Monitores..."
  data: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Análise' | 'Aprovado' | string;
  protocolo?: string;
}

interface SolicitacoesTableProps {
  rows: SolicitacaoRow[];
  onAnalyze?: (row: SolicitacaoRow) => void;
  onVerDetalhes?: (row: SolicitacaoRow) => void;
}

export default function SolicitacoesTable({ rows, onAnalyze, onVerDetalhes }: SolicitacoesTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: Todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('Prioridade: Todas');

  const filtered = rows.filter(r => {
    const matchesSearch = !search || 
      r.instituicao.toLowerCase().includes(search.toLowerCase()) || 
      r.cnpj.includes(search);
    const matchesStatus = statusFilter === 'Status: Todos' || 
      (statusFilter === 'Pendentes' && r.status === 'Pendente') ||
      (statusFilter === 'Em Análise' && r.status === 'Em Análise') ||
      (statusFilter === 'Aprovados' && r.status === 'Aprovado');
    const matchesPri = prioridadeFilter === 'Prioridade: Todas' || 
      r.prioridade === prioridadeFilter;
    return matchesSearch && matchesStatus && matchesPri;
  });

  const getPrioridadeIcon = (p: string) => {
    if (p === 'Alta') return 'local_fire_department';
    if (p === 'Média') return 'drag_handle';
    return 'stat_minus_1';
  };
  const getPrioridadeColor = (p: string) => {
    if (p === 'Alta') return 'text-red-600';
    if (p === 'Média') return 'text-orange-500';
    return 'text-green-600';
  };
  const getStatusClass = (s: string) => {
    if (s === 'Pendente') return 'bg-yellow-100 text-yellow-800';
    if (s === 'Aprovado') return 'bg-green-100 text-green-800';
    if (s === 'Em Análise') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleAction = (row: SolicitacaoRow) => {
    if (row.status === 'Aprovado' || row.status === 'Em Análise') {
      onVerDetalhes?.(row);
    } else {
      onAnalyze?.(row);
    }
  };

  const getActionLabel = (row: SolicitacaoRow) => {
    if (row.status === 'Aprovado') return 'Ver Detalhes';
    if (row.status === 'Em Análise') return 'Continuar';
    return 'Analisar';
  };

  return (
    <section className="bg-white rounded-[2rem] shadow-[0_12_32px_rgba(7,30,39,0.06)] border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          <input 
            type="text" 
            placeholder="Buscar instituição..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none bg-white"
        >
          <option>Status: Todos</option>
          <option>Pendentes</option>
          <option>Em Análise</option>
          <option>Aprovados</option>
        </select>
        <select 
          value={prioridadeFilter} 
          onChange={e => setPrioridadeFilter(e.target.value)}
          className="py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 outline-none bg-white"
        >
          <option>Prioridade: Todas</option>
          <option>Alta</option>
          <option>Média</option>
          <option>Baixa</option>
        </select>
        <button 
          onClick={() => { /* filters already reactive; could reset here */ }}
          className="bg-white border border-gray-200 py-2.5 px-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
        >
          Aplicar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-gray-100">
              <th className="px-6 py-5">Instituição</th>
              <th className="px-6 py-5">Itens Solicitados</th>
              <th className="px-6 py-5">Data</th>
              <th className="px-6 py-5">Prioridade</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhuma solicitação encontrada.</td></tr>
            )}
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      <span className="material-symbols-outlined text-[20px]">
                        {row.instituicao.includes('Escola') ? 'school' : row.instituicao.includes('ONG') ? 'volunteer_activism' : 'diversity_1'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{row.instituicao}</p>
                      <p className="text-[11px] text-gray-400 font-medium">CNPJ: {row.cnpj}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-bold text-gray-700">{row.itens}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{row.itensDetalhe || 'Equipamentos diversos'}</p>
                </td>
                <td className="px-6 py-5 text-gray-500 font-medium">{row.data}</td>
                <td className="px-6 py-5">
                  <span className={`flex items-center gap-1 font-bold text-xs ${getPrioridadeColor(row.prioridade)}`}>
                    <span className="material-symbols-outlined text-[14px]">{getPrioridadeIcon(row.prioridade)}</span> {row.prioridade}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${getStatusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => handleAction(row)} 
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm ${
                      row.status === 'Aprovado' 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {getActionLabel(row)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
