import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Calendar, Check, AlertTriangle, Utensils } from './ui/Icons';
import { validarReglasLogistica, obtenerPrecioPorPersona, formatearMoneda, obtenerLabelTour } from '../lib/utilidades';
import { DatosCreacionGrupo, TipoJeep, TipoTour } from '../types';
import { CONFIG } from '../lib/constantes';

const schema = z.object({
  nombreCompleto: z.string().min(3),
  email: z.string().email(),
  fecha: z.string().min(1),
  paxIniciales: z.number().min(1).max(6),
  tipoJeep: z.enum(['ESTANDAR', 'PRIVADO']),
  tipoTour: z.enum(['TRES_DIAS', 'CLASICA', 'INVERSA']),
  tipoDieta: z.enum(['NORMAL', 'VEGETARIANO', 'VEGANO', 'CELIACO']),
  detallesDieta: z.string().optional()
});

interface Props { isOpen: boolean; onClose: () => void; onCreate: (data: DatosCreacionGrupo) => void; }

export const ModalCrearGrupo: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fecha: '', paxIniciales: 1, tipoJeep: 'ESTANDAR', tipoTour: 'CLASICA', tipoDieta: 'NORMAL', nombreCompleto: '', email: '' }
  });

  const fecha = watch('fecha');
  const paxIniciales = watch('paxIniciales');
  const tipoJeep = watch('tipoJeep');
  const tipoTour = watch('tipoTour');

  const validacion = useMemo(() => validarReglasLogistica(fecha, paxIniciales), [fecha, paxIniciales]);
  const precioEstimado = obtenerPrecioPorPersona(paxIniciales);

  const onSubmit = (data: any) => {
    if (validacion.valido) {
      onCreate({
        ...data,
        cantidadPasajeros: data.paxIniciales, // mapeo de nombre
        ocupantes: data.paxIniciales,
        capacidadTotal: data.tipoJeep === 'ESTANDAR' ? 6 : 4,
        tipo: data.tipoJeep
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="bg-slate-800 p-5 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Plus className="text-yellow-500" /> Crear Grupo</h2>
          <button onClick={onClose}><X className="text-slate-400" /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-6">
           {/* Datos Básicos */}
           <div className="grid grid-cols-2 gap-4">
              <input {...register('nombreCompleto')} placeholder="Tu Nombre" className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
              <input {...register('email')} placeholder="Tu Email" className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
           </div>

           {/* Fecha y Validación */}
           <div>
             <label className="text-xs font-medium text-slate-400 block mb-1">Fecha de Salida</label>
             <input type="date" {...register('fecha')} min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
             
             {/* FEEDBACK VALIDACIÓN */}
             {fecha && (
               <div className={`mt-3 p-3 rounded-lg flex gap-3 text-sm ${validacion.valido ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {validacion.valido ? <Check size={18} /> : <AlertTriangle size={18} />}
                  <span>{validacion.valido ? "Fecha disponible y reglas cumplidas." : validacion.error}</span>
               </div>
             )}
           </div>

           {/* Configuración Jeep */}
           <div className="grid grid-cols-2 gap-4">
             <Controller name="tipoJeep" control={control} render={({ field }) => (
                <>
                  <div onClick={() => field.onChange('ESTANDAR')} className={`p-4 rounded-xl border text-center cursor-pointer ${field.value === 'ESTANDAR' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-slate-700 bg-slate-950 text-slate-400'}`}>
                     <div className="font-bold">Estándar (6 Pax)</div>
                  </div>
                  <div onClick={() => field.onChange('PRIVADO')} className={`p-4 rounded-xl border text-center cursor-pointer ${field.value === 'PRIVADO' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-slate-700 bg-slate-950 text-slate-400'}`}>
                     <div className="font-bold">Privado (4 Pax)</div>
                  </div>
                </>
             )} />
           </div>

           {/* Selección de Tipo de Tour */}
           <div>
             <label className="text-xs font-medium text-slate-400 block mb-2">Tipo de Recorrido</label>
             <Controller name="tipoTour" control={control} render={({ field }) => (
               <div className="grid grid-cols-3 gap-2">
                 {(['TRES_DIAS', 'CLASICA', 'INVERSA'] as TipoTour[]).map(tour => {
                   const label = obtenerLabelTour(tour);
                   return (
                     <div 
                       key={tour}
                       onClick={() => field.onChange(tour)} 
                       className={`p-3 rounded-lg border text-center cursor-pointer text-sm ${field.value === tour ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 'border-slate-700 bg-slate-950 text-slate-400'}`}
                     >
                       <div className="font-bold">{label.nombre}</div>
                       <div className="text-xs opacity-75">{label.dias} días</div>
                     </div>
                   );
                 })}
               </div>
             )} />
           </div>

           {/* Slider Pax */}
           <div>
              <div className="flex justify-between mb-2">
                 <span className="text-slate-300">Pasajeros Iniciales</span>
                 <span className="text-yellow-400 font-bold">{formatearMoneda(precioEstimado)} p/p</span>
              </div>
              <Controller name="paxIniciales" control={control} render={({ field }) => (
                 <input type="range" min="1" max={tipoJeep === 'ESTANDAR' ? 6 : 4} className="w-full accent-yellow-500" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              )} />
              <div className="text-center text-slate-400 text-sm mt-1">{paxIniciales} personas</div>
           </div>

           {/* Dietas */}
           <div className="pt-4 border-t border-slate-800">
              <label className="flex items-center gap-2 text-white mb-3"><Utensils size={16} className="text-yellow-500" /> Dieta Principal</label>
              <select {...register('tipoDieta')} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white mb-3 outline-none focus:border-yellow-500">
                 {CONFIG.DIETAS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <textarea {...register('detallesDieta')} placeholder="Alergias o detalles..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white text-sm outline-none focus:border-yellow-500" rows={2}></textarea>
           </div>

           <button type="submit" disabled={!validacion.valido} className="w-full bg-yellow-500 disabled:bg-slate-700 disabled:text-slate-500 hover:bg-yellow-400 text-slate-900 font-bold py-4 rounded-xl shadow-lg transition-all">
              Crear Grupo
           </button>
        </form>
      </div>
    </div>
  );
};