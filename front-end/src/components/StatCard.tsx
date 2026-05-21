'use client';

import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  /** Custom Tailwind classes for the icon container background (overrides color) */
  iconBgClass?: string;
  /** Enable the dashboard-style hover lift + bottom accent border */
  hoverAccent?: boolean;
  /** Additional classes for the root card */
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function StatCard({ 
  icon, 
  label, 
  value, 
  sub, 
  color = 'blue',
  iconBgClass,
  hoverAccent = false,
  className = ''
}: StatCardProps) {
  const iconBg = iconBgClass || colorClasses[color];
  const hoverClasses = hoverAccent 
    ? 'hover:border-b-2 hover:border-[#0d631b] hover:-translate-y-1 transition duration-300 ease-in-out' 
    : '';

  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-[0_12_32px_rgba(7,30,39,0.06)] flex flex-col gap-4 border border-gray-100 ${hoverClasses} ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{label}</span>
      </div>
      <div>
        <p className="text-3xl font-black text-[#071e27]">{value}</p>
        <p className="text-xs font-medium text-gray-600">{sub}</p>
      </div>
    </div>
  );
}
