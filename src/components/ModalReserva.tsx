import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Users, Utensils, ArrowRight } from './ui/Icons';
import { obtenerPrecioPorPersona, formatearMoneda, parsearFecha } from '../lib/utilidades';
import { Viaje, ReservaFormData } from '../types';
import { CONFIG } from '../lib/constantes';

// Esquema de validación
const schema = z.object({
  nombreCompleto: z.string().min(3, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  cantidadPasajeros: z.number().min(1, "Mínimo 1 pasajero"),
  tipoDieta: z.enum(['NORMAL', 'VEGETARIANO', 'VEGANO', 'CELIACO']),
  detallesDieta: z.string().optional()
});

interface Props {
  viaje: Viaje | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ReservaFormData) => void;
}

export const ModalReserva: React.FC<Props> = ({ viaje, isOpen, onClose, onConfirm }) => {
  // Resetear form cuando cambia el viaje o se abre
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReservaFormData>({
    resolver: zodResolver(schema),
    defaultValues: { cantidadPasajeros: 1, tipoDieta: 'NORMAL' }
  });

  const cantidadPasajeros = watch('cantidadPasajeros') || 1;

  // CÁLCULOS DINÁMICOS (CORE LOGIC)
  const calculos = useMemo(() => {
    if (!viaje) return null;
    
    const cuposDisponibles = viaje.capacidadTotal - viaje.ocupantes;
    const ocupacionFutura = viaje.ocupantes + Number(cantidadPasajeros);
    
    // El precio se basa en el FUTURO total del grupo (Incentivo)
    const precioUnitarioIncentivo = obtenerPrecioPorPersona(ocupacionFutura);
    const precioUnitarioActual = obtenerPrecioPorPersona(viaje.ocupantes);
    
    return {
      cuposDisponibles,
      precioUnitarioIncentivo,
      precioUnitarioActual,
      ahorroPorPersona: precioUnitarioActual - precioUnitarioIncentivo,
      totalPagar: precioUnitarioIncentivo * cantidadPasajeros
    };
  }, [viaje, cantidadPasajeros]);

  if (!isOpen || !viaje || !calculos) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 p-5 flex justify-between items-center border-b border-slate-700">
          <div>
             <h2 className="text-xl font-bold text-white">Unirse a la Salida</h2>
             <p className="text-xs text-slate-400">Fecha: {parsearFecha(viaje.fecha).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* BANNER DE INCENTIVO DE PRECIO */}
          <div className="bg-gradient-to-r from-blue-900/40 to-slate-800 border border-blue-500/30 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
               <span className="text-sm text-blue-300 font-medium">Precio Dinámico</span>
               <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-500/30">Ahorro Activo</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-slate-400 line-through text-sm">{formatearMoneda(calculos.precioUnitarioActual)}</div>
                <ArrowRight size={16} className="text-slate-500" />
                <div className="text-2xl font-bold text-white">{formatearMoneda(calculos.precioUnitarioIncentivo)}</div>
                <div className="text-xs text-green-400 font-medium">
                   (Ahorras {formatearMoneda(calculos.ahorroPorPersona)} p/p al completar cupos)
                </div>
            </div>
          </div>

          <form id="reservaForm" onSubmit={handleSubmit(onConfirm)} className="space-y-4">
             {/* Datos Personales */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo</label>
                  <input {...register('nombreCompleto')} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 focus:outline-none" placeholder="Tu nombre" />
                  {errors.nombreCompleto && <span className="text-red-400 text-xs">{errors.nombreCompleto.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input {...register('email')} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 focus:outline-none" placeholder="correo@ejemplo.com" />
                  {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                </div>
             </div>

             {/* Cantidad Pasajeros (RESTRICCIÓN FÍSICA) */}
             <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Pasajeros a reservar</label>
                <div className="relative">
                    <Users className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input 
                      type="number" 
                      {...register('cantidadPasajeros', { valueAsNumber: true })}
                      min={1}
                      max={calculos.cuposDisponibles} // RESTRICCIÓN FÍSICA CRÍTICA
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pl-10 text-white focus:border-yellow-500 focus:outline-none"
                    />
                </div>
                <div className="flex justify-between text-xs mt-1 text-slate-500">
                   <span>Mínimo: 1</span>
                   <span>Máximo disponible: {calculos.cuposDisponibles}</span>
                </div>
                {errors.cantidadPasajeros && <span className="text-red-400 text-xs">Cupos insuficientes para esta cantidad</span>}
             </div>

             {/* Dieta y Alergias */}
             <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-sm font-medium text-white flex items-center gap-2">
                   <Utensils size={16} className="text-yellow-500" /> Preferencias Alimenticias
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                   {CONFIG.DIETAS.map(dieta => (
                     <label key={dieta.value} className={`border rounded-lg p-3 cursor-pointer text-sm transition-all ${watch('tipoDieta') === dieta.value ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-slate-950 border-slate-700 text-slate-400'}`}>
                        <input type="radio" value={dieta.value} {...register('tipoDieta')} className="hidden" />
                        <span className="font-medium">{dieta.label}</span>
                     </label>
                   ))}
                </div>

                <div>
                   <label className="block text-xs font-medium text-slate-400 mb-1">Alergias o detalles (Opcional)</label>
                   <textarea {...register('detallesDieta')} rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-yellow-500 focus:outline-none" placeholder="Ej: Alergia al maní, intolerancia a la lactosa..."></textarea>
                </div>
             </div>
          </form>
        </div>

        {/* Footer Total y Submit */}
        <div className="bg-slate-800 p-5 border-t border-slate-700">
           <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm">Total Estimado ({cantidadPasajeros} pax)</span>
              <span className="text-2xl font-bold text-white">{formatearMoneda(calculos.totalPagar)}</span>
           </div>
           <button form="reservaForm" type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl shadow-lg shadow-yellow-500/20 transition-all">
              Confirmar Reserva
           </button>
        </div>
      </div>
    </div>
  );
};