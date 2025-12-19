import React from 'react';
import { Viaje } from '../types';
import { obtenerPrecioPorPersona, formatearMoneda, parsearFecha, obtenerLabelTour } from '../lib/utilidades';
import { MapPin, ArrowRight } from './ui/Icons';

interface Props {
  viaje: Viaje;
  onJoin: (viaje: Viaje) => void;
}

export const TarjetaJeep: React.FC<Props> = ({ viaje, onJoin }) => {
  const porcentaje = (viaje.ocupantes / viaje.capacidadTotal) * 100;
  const esLleno = viaje.ocupantes >= viaje.capacidadTotal;
  const precioActual = obtenerPrecioPorPersona(viaje.ocupantes);
  
  // Proyección de precio si entra 1 persona más (Incentivo Visual)
  const proximoPrecio = !esLleno ? obtenerPrecioPorPersona(viaje.ocupantes + 1) : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 hover:border-yellow-500/50 transition-all duration-300 shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={viaje.imagen} alt="Jeep" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
        
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
          <div>
            <div className="text-xs font-medium text-yellow-400 mb-1">{obtenerLabelTour(viaje.tipoTour).nombre}</div>
            <h3 className="text-xl font-bold text-white mb-1">{parsearFecha(viaje.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</h3>
            <p className="text-sm text-slate-300 flex items-center gap-1"><MapPin size={16} /> Uyuni, BO</p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-yellow-400">{formatearMoneda(precioActual)}</span>
            <span className="text-xs text-slate-400">p/p actual</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 font-medium">Ocupación</span>
            <span className={`font-bold ${esLleno ? 'text-red-400' : 'text-green-400'}`}>
              {viaje.ocupantes} / {viaje.capacidadTotal}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-500 rounded-full ${esLleno ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${porcentaje}%` }}></div>
          </div>
          {!esLleno && (
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <ArrowRight size={14} className="text-yellow-500" />
              Únete y paga solo <span className="text-green-400 font-bold">{formatearMoneda(proximoPrecio)}</span>
            </p>
          )}
        </div>

        <button 
          onClick={() => onJoin(viaje)}
          disabled={esLleno}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            esLleno ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-lg'
          }`}
        >
          {esLleno ? 'Grupo Completo' : 'Unirse al Grupo'}
        </button>
      </div>
    </div>
  );
};