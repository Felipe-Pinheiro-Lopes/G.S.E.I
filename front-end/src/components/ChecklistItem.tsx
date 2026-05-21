import React from 'react';

interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ChecklistItem({ label, checked, onToggle }: ChecklistItemProps) {
  return (
    <label 
      onClick={onToggle}
      className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary/20 transition-all cursor-pointer group"
    >
      <input 
        type="checkbox" 
        checked={checked}
        onChange={() => {}} 
        className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary transition-all"
      />
      <span className="text-sm font-bold text-gray-700 group-hover:text-primary">{label}</span>
    </label>
  );
}
