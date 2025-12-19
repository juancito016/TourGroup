export type TipoJeep = 'ESTANDAR' | 'PRIVADO';
export type TipoDieta = 'NORMAL' | 'VEGETARIANO' | 'VEGANO' | 'CELIACO';
export type TipoTour = 'TRES_DIAS' | 'CLASICA' | 'INVERSA';

export interface FiltroBusqueda {
  fecha?: string;
  pax?: number;
}

export interface Viaje {
  id: number;
  fecha: string;
  ocupantes: number;
  capacidadTotal: number;
  tipo: TipoJeep;
  tipoTour: TipoTour;
  imagen: string;
}

export interface ReservaFormData {
  nombreCompleto: string;
  email: string;
  cantidadPasajeros: number;
  tipoDieta: TipoDieta;
  detallesDieta?: string;
}

export interface DatosCreacionGrupo extends ReservaFormData {
  fecha: string;
  tipoJeep: TipoJeep;
  tipoTour: TipoTour;
  detallesDieta?: string;
}