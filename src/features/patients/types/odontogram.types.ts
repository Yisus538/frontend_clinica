export interface ToothState {
  id: number;
  top: string;
  bottom: string;
  left: string;
  right: string;
  center: string;
  note: string;
}

export type Surface = 'top' | 'bottom' | 'left' | 'right' | 'center';

export const COLORS = [
  { id: 'sano', label: 'Sano / Limpiar', hex: '#ffffff', border: 'border-outline-variant' },
  { id: 'existente', label: 'Existente (Rojo)', hex: '#ba1a1a', border: 'border-error' },
  { id: 'requerida', label: 'Requerida (Azul)', hex: '#004ac6', border: 'border-primary' },
  { id: 'ausente', label: 'Ausente/Extraer', hex: '#0d1c2e', border: 'border-on-surface' },
  { id: 'corona', label: 'Corona', hex: '#eab308', border: 'border-yellow-600' },
];

export const adultTeethIds = [
  18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28,
  48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38
];

export const pediatricTeethIds = [
  55,54,53,52,51, 61,62,63,64,65,
  85,84,83,82,81, 71,72,73,74,75
];

export const allTeethIds = [...adultTeethIds, ...pediatricTeethIds];

export const initialToothState = (id: number): ToothState => ({
  id, top: '#ffffff', bottom: '#ffffff', left: '#ffffff', right: '#ffffff', center: '#ffffff', note: ''
});
