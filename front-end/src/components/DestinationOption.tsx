import React from 'react';

interface DestinationOptionProps {
  value: string;
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export default function DestinationOption({ value, icon, label, description, selected, onSelect }: DestinationOptionProps) {
  return (
    <label 
      onClick={() => onSelect(value)}
      className={`relative flex flex-col p-5 border-2 rounded-[24px] cursor-pointer transition-all 
        ${selected ? 'border-primary bg-green-50' : 'border-gray-100 hover:bg-green-50/50'}`}
    >
      <input 
        type="radio" 
        name="destino" 
        checked={selected} 
        onChange={() => {}} 
        className="absolute top-4 right-4 text-primary focus:ring-primary" 
      />
      <span className="material-symbols-outlined text-primary mb-3">{icon}</span>
      <p className="font-black text-on-surface">{label}</p>
      <p className="text-[10px] font-medium text-gray-500 leading-tight mt-1">{description}</p>
    </label>
  );
}
