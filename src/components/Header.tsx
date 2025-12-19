import React from 'react';
import { Plus } from './ui/Icons';

interface Props {
  onCreateClick: () => void;
}

export const Header: React.FC<Props> = ({ onCreateClick }) => (
  <header className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">U</div>
        <h1 className="text-xl font-bold tracking-tight text-white">Uyuni<span className="text-yellow-500">Pooling</span></h1>
      </div>
      <button 
        onClick={onCreateClick}
        className="hidden md:flex bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 items-center gap-2"
      >
        <Plus size={16} /> Crear Grupo
      </button>
    </div>
  </header>
);