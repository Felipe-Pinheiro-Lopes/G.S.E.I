'use client';

import React from 'react';

interface CategorySegment {
  label: string;
  percent: number;
  color: string; // hex e.g. '#16a34a'
}

interface CategoriesDonutProps {
  segments: CategorySegment[];
  total: number | string;
  title?: string;
}

export default function CategoriesDonut({ segments, total, title = "Top Categorias" }: CategoriesDonutProps) {
  // Build conic-gradient string dynamically
  const gradientStops: string[] = [];
  let current = 0;
  segments.forEach((seg) => {
    const next = current + seg.percent;
    gradientStops.push(`${seg.color} ${current}% ${next}%`);
    current = next;
  });
  const gradient = `conic-gradient(${gradientStops.join(', ')})`;

  return (
    <div className="bg-surface-container-lowest border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-[0_12_32px_rgba(7,30,39,0.04)]">
      <h4 className="text-lg font-bold text-on-surface mb-6 w-full text-left">{title}</h4>
      
      <div 
        className="relative w-48 h-48 rounded-full shadow-inner" 
        style={{ background: gradient }}
      >
        <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
          <span className="text-2xl font-black text-gray-800">{total}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] font-semibold w-full">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }}></span>
            {seg.label} ({seg.percent}%)
          </div>
        ))}
      </div>
    </div>
  );
}
