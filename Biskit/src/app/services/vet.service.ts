import { Injectable } from '@angular/core';
import { Vet } from '../models/Vets/vet-cl';
import { CredencialesService } from './credenciales.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VetService {

  constructor( private http: HttpClient ) { }

  // ----- Crear y Actualizar Veterinario (CREATE/UPDATE) -----
  saveVet(vet: Vet): Observable<Vet> {
    if (vet.id)
      return this.http.put<Vet>(`http://localhost:8080/vets/update/${vet.id}`, vet);
    else
      return this.http.post<Vet>('http://localhost:8080/vets/add', vet);
  }

  // ----- Mostrar Todos los Veterinarios (READ) -----
  findAll(): Observable<Vet[]> {
    return this.http.get<Vet[]>('http://localhost:8080/vets');
  }

  // ----- Mostrar Veterinario por ID (READ) -----
  findById(id: number): Observable<Vet> {
    return this.http.get<Vet>(`http://localhost:8080/vets/${id}`);
  }

  // saveVet(vet: Vet): void {
  //   if (vet.id) {
  //     const index = this.vets.findIndex(v => v.id === vet.id);
  //     if (index !== -1) {
  //       this.vets[index] = vet;
  //     }
  //   } else {
  //     // Busca el id máximo de los veterinarios y le suma 1
  //     const nuevoId = this.vets.length > 0 ? Math.max(...this.vets.map(v => v.id ?? 0)) + 1 : 1;
  //     vet.id = nuevoId;
  //     vet.estado = true; // Por defecto, el nuevo veterinario estará activo

  //     vet.credenciales = { usuario: vet.correo, password: vet.cedula }; // Credenciales por defecto
  //     this.credencialesService.addCredenciales(vet.credenciales);
      
  //     this.vets.push(vet);
  //   }
  // }

  // getVetById(id: number): Vet {
  //   const vet = this.vets.find(v => v.id === id);
  //   if (!vet) {
  //     throw new Error(`Veterinario con id ${id} no encontrado`);
  //   }
  //   return vet;
  // }


}
