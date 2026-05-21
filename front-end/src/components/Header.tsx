'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showNotifications?: boolean;
  showNotificationBadge?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ 
  title, 
  showSearch = true, 
  searchPlaceholder = "Buscar...",
  showNotifications = true,
  showNotificationBadge = false,
  onMenuClick 
}: HeaderProps) {
  return (
    <header className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur flex justify-between items-center px-4 md:px-8 py-4 border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition"
          aria-label="Abrir menu"
        >
          <span className="material-symbols-outlined text-green-800">menu</span>
        </button>
        <h1 className="font-black text-green-800 text-xl hidden sm:block">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full w-[300px]">
            <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-gray-700" 
            />
          </div>
        )}
        {showNotifications && (
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition relative">
            <span className="material-symbols-outlined">notifications</span>
            {showNotificationBadge && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
