import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONFIG } from "./constantes";
import { TipoTour } from "../types";
import { tresDias, clasica, inversa, salar1, salar2, salar3 } from '../assets';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export const formatearMoneda = (cantidad: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cantidad);
};

export const obtenerPrecioPorPersona = (cantidadPax: number) => {
  // Si por error supera 6, cobra precio de 6. Si es 0, cobra precio de 1.
  const pax = Math.min(Math.max(cantidadPax, 1), 6);
  return CONFIG.PRECIOS[pax];
};

// Parsear fecha en formato YYYY-MM-DD sin problemas de timezone
export const parsearFecha = (fechaString: string): Date => {
  const [año, mes, día] = fechaString.split('-').map(Number);
  return new Date(año, mes - 1, día);
};

// Formatear fecha a string YYYY-MM-DD
export const formatearFecha = (fecha: Date): string => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const día = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${día}`;
};

export const obtenerDiasRestantes = (fechaSalida: string | Date) => {
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  const destino = typeof fechaSalida === 'string' ? parsearFecha(fechaSalida) : fechaSalida;
  destino.setHours(0,0,0,0);
  const diffTime = destino.getTime() - hoy.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

export interface ValidacionResultado {
  valido: boolean;
  error: string | null;
  tipo: 'ERROR' | 'CRITICO' | 'URGENTE' | 'ESTANDAR';
}

export const validarReglasLogistica = (fechaStr: string, cantidadPax: number): ValidacionResultado => {
  if (!fechaStr) return { valido: false, error: null, tipo: 'ERROR' };
  
  // Fix zona horaria simple para evitar errores de "ayer" si se crea tarde
  const [year, month, day] = fechaStr.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  
  const diasRestantes = obtenerDiasRestantes(fecha);

  if (diasRestantes < 0) return { valido: false, error: "La fecha no puede ser en el pasado.", tipo: 'ERROR' };

  // REGLA 1: ZONA CRÍTICA (< 3 días)
  if (diasRestantes < CONFIG.REGLAS.DIAS_CRITICOS) {
      return { valido: false, error: "Zona Crítica: Salidas en < 72h solo vía WhatsApp.", tipo: 'CRITICO' };
  }

  // REGLA 2: ZONA URGENTE (3 a 5 días)
  if (diasRestantes <= CONFIG.REGLAS.DIAS_URGENTES) {
      if (cantidadPax < 4) {
          return { valido: false, error: `Zona Urgente (${diasRestantes} días): Requiere mín. 4 personas.`, tipo: 'URGENTE' };
      }
      return { valido: true, error: null, tipo: 'URGENTE' };
  }

  return { valido: true, error: null, tipo: 'ESTANDAR' };
};

// Obtener imagen según tipo de tour
export const obtenerImagenPorTour = (tipoTour: TipoTour): string => {
  const imagenes: Record<TipoTour, string> = {
    TRES_DIAS: tresDias,
    CLASICA: clasica,
    INVERSA: inversa
  };
  return imagenes[tipoTour] || imagenes.CLASICA;
};

// Labels para tipos de tour
export const obtenerLabelTour = (tipoTour: TipoTour): { nombre: string; dias: number } => {
  const labels: Record<TipoTour, { nombre: string; dias: number }> = {
    TRES_DIAS: { nombre: 'Laguna Colorada', dias: 3 },
    CLASICA: { nombre: 'Ruta Clásica', dias: 4 },
    INVERSA: { nombre: 'Ruta Inversa', dias: 4 }
  };
  return labels[tipoTour];
};

// Exportar imágenes del salar para el carousel
export const IMAGENES_SALAR = [salar1, salar2, salar3];