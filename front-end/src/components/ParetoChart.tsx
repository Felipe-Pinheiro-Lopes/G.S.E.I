'use client';

import React from 'react';

interface ParetoItem {
  defeito: string;
  quantidade: number;
}

interface ParetoChartProps {
  data: ParetoItem[];
  title?: string;
  subtitle?: string;
  dataLoaded?: boolean;
}

export default function ParetoChart({ 
  data, 
  title = "Pareto de Defeitos", 
  subtitle = "Problemas mais encontrados na semana",
  dataLoaded = true 
}: ParetoChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="lg:col-span-2 bg-[#dbf1fe] rounded-xl p-4 sm:p-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex text-center justify-center items-center">
          <div>
            <h4 className="text-xl font-bold text-[#071e27]">{title}</h4>
            <p className="text-xs font-medium text-gray-600">{subtitle}</p>
          </div>
        </div>
        <div className="text-gray-400 text-center py-8">Sem dados disponíveis</div>
      </div>
    );
  }

  const max = Math.max(...data.map(p => p.quantidade));

  return (
    <div className="lg:col-span-2 bg-[#dbf1fe] rounded-xl p-4 sm:p-8 flex flex-col gap-6 overflow-hidden">
      <div className="flex text-center justify-center items-center">
        <div className="block">
          <h4 className="text-xl font-bold text-[#071e27]">{title}</h4>
          <p className="text-xs font-medium text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
        {data.map((item, index) => {
          const heightPercent = max > 0 ? (item.quantidade / max) * 100 : 0;
          return (
            <div 
              key={index} 
              className="flex-1 bg-[#0d631b]/20 rounded-t-lg relative group hover:bg-[#0d631b]/40 min-w-[40px] transition-all duration-700 ease-out"
              style={{ 
                height: dataLoaded ? `${heightPercent}%` : '0%',
                transitionDelay: `${index * 120}ms`
              }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#071e27] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.quantidade}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between px-2 sm:px-4 text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2 text-center">
        {data.map((item, i) => (
          <span key={i} className="flex-1">{item.defeito}</span>
        ))}
      </div>
    </div>
  );
}
