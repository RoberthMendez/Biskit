import { Especie } from './especie';

export interface Raza {
  id: number;
  nombre: string;
  especie?: Especie;
}
