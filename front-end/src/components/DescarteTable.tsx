'use client';

import React, { useState } from 'react';

export interface DescarteItem {
  id: number | string;
  descricao: string;
  codigo: string;      // EQ-XXXX
  lote: string;
  data: string;
  status: 'Descartado' | 'Aguardando' | string;
  responsavel: string;
  tipo: string;        // for icon (Notebook, Monitor, etc.)
  laudo?: string;
}

interface DescarteTableProps {
  items: DescarteItem[];
  onAction?: (item: DescarteItem) => void;
  loading?: boolean;
}

export default function DescarteTable({ items, onAction }: DescarteTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [categoriaFilter, setCategoriaFilter] = useState('Categoria');
  const [periodoFilter, setPeriodoFilter] = useState('Período');

  const filtered = items.filter(item => {
    const matchesSearch = !search ||
      item.descricao.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase()) ||
      item.lote.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'Status' || item.status === statusFilter;
    const matchesCat = categoriaFilter === 'Categoria' || item.tipo === categoriaFilter;
    const matchesPeriodo = periodoFilter === 'Período' || true;

    return matchesSearch && matchesStatus && matchesCat && matchesPeriodo;
  });

  const getIcon = (tipo: string) => {
    if (tipo.includes('Notebook') || tipo.includes('Laptop')) return 'laptop_mac';
    if (tipo.includes('Monitor')) return 'desktop_windows';
    if (tipo.includes('CPU') || tipo.includes('Desktop')) return 'dns';
    if (tipo.includes('Teclado') || tipo.includes('Perif')) return 'keyboard';
    return 'inventory_2';
  };

  const getStatusClass = (status: string) => {
    if (status === 'Descartado') return 'bg-green-100 text-green-700';
    if (status === 'Aguardando') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl h-12 px-4 shadow-sm focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition">
              <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar por item, ID ou lote..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-gray-700"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition"
          >
            <option>Status</option>
            <option>Descartado</option>
            <option>Aguardando</option>
          </select>

          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition"
          >
            <option>Categoria</option>
            <option>Notebooks</option>
            <option>Monitores</option>
            <option>Desktops</option>
            <option>Periféricos</option>
          </select>

          <div className="flex gap-3">
            <select
              value={periodoFilter}
              onChange={(e) => setPeriodoFilter(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition"
            >
              <option>Período</option>
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('Status');
                setCategoriaFilter('Categoria');
                setPeriodoFilter('Período');
              }}
              className="h-12 w-12 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 transition flex items-center justify-center shadow-sm"
              title="Limpar Filtros"
            >
              <span className="material-symbols-outlined text-[20px]">filter_alt_off</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-400 font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 hidden sm:table-cell">Item</th>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">ID do Item</th>
              <th className="px-6 py-4 hidden md:table-cell">Lote</th>
              <th className="px-6 py-4 hidden md:table-cell">Data</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 hidden lg:table-cell">Responsável</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">Nenhum item encontrado.</td>
              </tr>
            )}
            {filtered.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition ${item.status === 'Aguardando' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50'}`}>
                    <span className="material-symbols-outlined text-lg">{getIcon(item.tipo)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{item.descricao}</td>
                <td className="px-6 py-4 text-gray-500 font-medium">{item.codigo}</td>
                <td className="px-6 py-4 text-gray-500 font-medium hidden md:table-cell">{item.lote}</td>
                <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{item.data}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium hidden lg:table-cell">{item.responsavel}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onAction?.(item)}
                    className="text-gray-400 hover:text-blue-600 transition p-1 rounded-md hover:bg-blue-100"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
