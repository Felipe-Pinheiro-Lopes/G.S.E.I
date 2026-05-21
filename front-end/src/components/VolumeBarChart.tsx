'use client';

import React from 'react';

interface BarData {
  month: string;
  height: number; // percentage 0-100
  value?: number; // optional label on top for highlighted
  isHighlight?: boolean;
}

interface VolumeBarChartProps {
  data: BarData[];
  title?: string;
  subtitle?: string;
  yearLabel?: string;
}

export default function VolumeBarChart({ 
  data, 
  title = "Volume de Doações", 
  subtitle = "Equipamentos doados por mês (2024)",
  yearLabel = "Este Ano" 
}: VolumeBarChartProps) {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_12_32px_rgba(7,30,39,0.04)]">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-xl font-bold text-on-surface">{title}</h4>
          <p className="text-xs font-medium text-on-surface-variant">{subtitle}</p>
        </div>
        <select className="bg-gray-50 border-none text-xs font-bold rounded-lg py-2 px-3 text-gray-600 outline-none" defaultValue={yearLabel}>
          <option>{yearLabel}</option>
        </select>
      </div>

      <div className="relative h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 overflow-x-auto scrollbar-hide">
        {data.map((bar, i) => (
          <div 
            key={i} 
            className={`flex-1 ${bar.isHighlight ? 'bg-primary/80' : 'bg-green-200'} rounded-t-lg relative group transition-all hover:bg-primary min-w-[30px]`} 
            style={{ height: `${bar.height}%` }}
          >
                    {bar.value && (
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded font-medium ${bar.isHighlight ? 'bg-on-surface text-white' : 'bg-gray-100 text-gray-600'}`}>
                {bar.value}
              </div>
            )}
            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${bar.isHighlight ? 'text-gray-800' : 'text-gray-400'}`}>
              {bar.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
