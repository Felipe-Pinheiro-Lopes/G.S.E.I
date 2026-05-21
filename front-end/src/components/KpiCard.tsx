'use client';

import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: 'blue' | 'orange' | 'green' | 'red';
}

const colorMap = {
  blue: 'text-blue-500',
  orange: 'text-orange-500',
  green: 'text-green-500',
  red: 'text-red-500',
};

export default function KpiCard({ label, value, icon, color = 'blue' }: KpiCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs md:text-sm uppercase tracking-widest text-gray-500 font-bold mb-1">
            {label}
          </p>
          <p className="text-3xl md:text-4xl font-black text-[#071e27] mt-1">
            {value}
          </p>
        </div>
        {icon && (
          <span className={`material-symbols-outlined text-4xl md:text-5xl text-gray-300 ${colorMap[color]}`}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}
