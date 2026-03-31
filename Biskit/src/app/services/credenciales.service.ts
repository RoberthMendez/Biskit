import { Injectable } from '@angular/core';
import { Credenciales } from '../modelo/Credenciales/credenciales';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  constructor() { }

  credenciales: Credenciales[] = [];

  addCredenciales(credenciales: Credenciales): void {
    this.credenciales.push(credenciales);
  }

}
