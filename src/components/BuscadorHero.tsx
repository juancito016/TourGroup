import React, { useState } from 'react';
import { Calendar, Users, Search } from './ui/Icons';
import { FiltroBusqueda } from '../types';

interface Props {
  onSearch: (filtro: FiltroBusqueda) => void;
}

export const BuscadorHero: React.FC<Props> = ({ onSearch }) => {
  const [fecha, setFecha] = useState('');
  const [pax, setPax] = useState('1');

  const handleSearch = () => {
    onSearch({ fecha, pax: parseInt(pax) });
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-8 relative z-10 px-4">
      <div className="glass-panel rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold ml-1">Fecha de Salida</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar size={18} />
            </div>
            <input 
              type="date" 
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold ml-1">Pasajeros</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Users size={18} />
            </div>
            <select 
              className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 appearance-none transition-colors"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
            >
              <option value="1">1 Persona</option>
              <option value="2">2 Personas</option>
              <option value="3">3 Personas</option>
              <option value="4">4+ Personas</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full md:w-auto mt-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          <Search size={20} />
          Buscar
        </button>
      </div>
    </div>
  );
};