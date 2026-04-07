import { Injectable } from '@angular/core';
import { Credenciales } from '../modelo/Credenciales/credenciales';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  constructor() { }

  credenciales: Credenciales[] = [
    new Credenciales(1,'admin', 'admin123'),
    new Credenciales(2,'vet', 'vet123'),
    new Credenciales(3,'client', 'client123')
  ];



  addCredenciales(credenciales: Credenciales): void {
    this.credenciales.push(credenciales);
  }

  checkCredenciales(usuario: string, contrasena: string): boolean {
    return this.credenciales.some(credencial => credencial.usuario === usuario && credencial.password === contrasena);
  }

}
