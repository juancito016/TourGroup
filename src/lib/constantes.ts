// Configuración maestra de Precios, Dietas y Reglas
export const CONFIG = {
  PRECIOS: {
    1: 800,
    2: 420,
    3: 290,
    4: 215,
    5: 195,
    6: 180
  } as Record<number, number>,
  
  CAPACIDAD: {
    ESTANDAR: 6,
    PRIVADO: 4
  },
  
  REGLAS: {
    DIAS_CRITICOS: 3, // < 3 días: Bloqueado (WhatsApp)
    DIAS_URGENTES: 5, // 3-5 días: Mínimo 4 pax
  },

  DIETAS: [
    { value: 'NORMAL', label: 'Normal (Omnívoro)' },
    { value: 'VEGETARIANO', label: 'Vegetariano' },
    { value: 'VEGANO', label: 'Vegano' },
    { value: 'CELIACO', label: 'Sin Gluten (Celíaco)' }
  ]
};