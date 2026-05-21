'use client';

import React from 'react';

interface DescarteKpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub: string;
  color?: 'green' | 'yellow' | 'blue' | 'purple';
}

const colorClasses = {
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-600',
  blue: 'bg-blue-50 text-blue-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function DescarteKpiCard({ icon, label, value, sub, color = 'green' }: DescarteKpiCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-5">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{value}</h3>
          <p className="text-xs text-gray-500 mt-1">{sub}</p>
        </div>
      </div>
    </div>
  );
}
