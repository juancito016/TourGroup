import { useState, useEffect, useMemo } from 'react';
import { BuscadorHero } from './components/BuscadorHero';
import { TarjetaJeep } from './components/TarjetaJeep';
import { ModalCrearGrupo } from './components/ModalCrearGrupo';
import { ModalReserva } from './components/ModalReserva';
import { Plus } from './components/ui/Icons';
import { Viaje, DatosCreacionGrupo, ReservaFormData } from './types';
import { obtenerImagenPorTour, IMAGENES_SALAR } from './lib/utilidades';
import { tresDias, clasica, inversa } from './assets';
 
// Hero Carousel: muestra imágenes en un carrusel de fundido suave
function HeroCarousel({ images, interval = 6000, onCreateClick }: { images: string[]; interval?: number; onCreateClick?: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <div className="relative h-[500px] w-full flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`hero-${i}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 transform ${i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{ transitionTimingFunction: 'ease-in-out' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-10">
        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs font-bold tracking-wide mb-4">
          ECONOMÍA COLABORATIVA EN UYUNI
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Viaja más barato.<br/>Llena el Jeep.
        </h2>
        <p className="text-lg text-slate-200 mb-8 max-w-xl mx-auto leading-relaxed">
          El precio baja cuando más gente se une. Conecta con otros viajeros, completa los cupos y asegura tu aventura en el Salar.
        </p>

        <button 
          onClick={() => onCreateClick && onCreateClick()}
          className="md:hidden w-full bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Crear Grupo
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  
  // Estado para gestionar qué viaje se está intentando reservar
  const [viajeSeleccionado, setViajeSeleccionado] = useState<Viaje | null>(null);
  const [trips, setTrips] = useState<Viaje[]>([]);
  const [filtro, setFiltro] = useState<null | { fecha?: string; pax?: number }>(null);

  useEffect(() => {
    // Datos simulados iniciales
    setTrips([
      { id: 1, fecha: '2025-04-15', ocupantes: 3, capacidadTotal: 6, tipo: 'ESTANDAR', tipoTour: 'TRES_DIAS', imagen: tresDias },
      { id: 2, fecha: '2025-04-18', ocupantes: 5, capacidadTotal: 6, tipo: 'ESTANDAR', tipoTour: 'CLASICA', imagen: clasica },
      { id: 3, fecha: '2025-04-22', ocupantes: 2, capacidadTotal: 6, tipo: 'ESTANDAR', tipoTour: 'INVERSA', imagen: inversa }
    ]);
  }, []);

  const handleCreate = (data: DatosCreacionGrupo) => {
    const capacidadPorTipo = data.tipoJeep === 'PRIVADO' ? 4 : 6;
    const nuevoViaje: Viaje = {
      id: Date.now(),
      fecha: data.fecha,
      ocupantes: data.cantidadPasajeros,
      capacidadTotal: capacidadPorTipo,
      tipo: data.tipoJeep,
      tipoTour: data.tipoTour,
      imagen: obtenerImagenPorTour(data.tipoTour)
    };
    setTrips(prev => [nuevoViaje, ...prev]);
    console.log("Grupo creado con dieta:", data.tipoDieta);
    alert("¡Grupo Creado Exitosamente!");
  };

  const handleSearch = (f: { fecha?: string; pax?: number }) => {
    // Guardamos el filtro; BuscadorHero ya envía solo fecha o pax (OR)
    setFiltro(f);
  };

  // Manejo de apertura del modal de reserva
  const handleJoinClick = (viaje: Viaje) => {
    setViajeSeleccionado(viaje);
    setModalReservaOpen(true);
  };

  // Confirmación de reserva
  const handleConfirmReserva = (data: ReservaFormData) => {
    if (!viajeSeleccionado) return;
    
    setTrips(prev => prev.map(t => {
      if (t.id === viajeSeleccionado.id) {
        return { ...t, ocupantes: t.ocupantes + data.cantidadPasajeros };
      }
      return t;
    }));

    setModalReservaOpen(false);
    setViajeSeleccionado(null);
    alert(`¡Reserva Confirmada! Has reservado para ${data.cantidadPasajeros} persona(s). Preferencia: ${data.tipoDieta}`);
  };

  return (
    <div className="min-h-screen pb-20 font-sans">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Uyuni<span className="text-yellow-500">Pooling</span></h1>
          <button onClick={() => setModalCrearOpen(true)} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex gap-2 items-center hover:bg-yellow-400">
            <Plus size={16} /> Crear Grupo
          </button>
        </div>
      </header>

      <HeroCarousel images={IMAGENES_SALAR} onCreateClick={() => setModalCrearOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <BuscadorHero onSearch={handleSearch} />

        <h2 className="text-2xl font-bold mb-6">Próximas Salidas</h2>

        {/* Filtrado: si hay filtro aplicado, usamos filteredTrips */}
        {useMemo(() => {
          const filtered = (() => {
            if (!filtro) return trips;
            if (filtro.fecha) {
              return trips.filter(t => t.fecha === filtro.fecha);
            }
            if (typeof filtro.pax === 'number') {
              return trips.filter(t => (t.capacidadTotal - t.ocupantes) >= (filtro.pax || 0));
            }
            return trips;
          })();

          return (
            <>
              {filtro && (
                <div className="mb-4 text-sm text-slate-300">
                  Filtrando por: {filtro.fecha ? `Fecha ${filtro.fecha}` : `Pasajeros ${filtro.pax}`}
                  <button className="ml-4 text-yellow-400 font-semibold" onClick={() => setFiltro(null)}>Limpiar</button>
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="text-slate-400">No hay viajes que coincidan con el filtro.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(trip => (
                    <TarjetaJeep key={trip.id} viaje={trip} onJoin={handleJoinClick} />
                  ))}
                </div>
              )}
            </>
          );
        }, [trips, filtro])}
      </main>

      <ModalCrearGrupo isOpen={modalCrearOpen} onClose={() => setModalCrearOpen(false)} onCreate={handleCreate} />
      
      <ModalReserva 
        viaje={viajeSeleccionado} 
        isOpen={modalReservaOpen} 
        onClose={() => setModalReservaOpen(false)} 
        onConfirm={handleConfirmReserva} 
      />
    </div>
  );
}