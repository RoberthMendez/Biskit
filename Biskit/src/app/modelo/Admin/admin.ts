import { Credenciales } from '../Credenciales/credenciales';

export interface Admin {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  credenciales: Credenciales;
}
