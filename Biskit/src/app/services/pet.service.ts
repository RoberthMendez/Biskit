import { Injectable } from '@angular/core';
import { Pet } from '../models/Pets/pet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface UpdateEstadoResponse {
//   ok?: boolean;
//   message?: string;
// }

@Injectable({
  providedIn: 'root',
})
export class PetService {

  constructor( private http: HttpClient ) {}

  // ----- Crear y Actualizar Mascota (CREATE/UPDATE) -----
  savePet(pet: Pet): Observable<Pet> {
    if (pet.id)
      return this.http.put<Pet>(`http://localhost:8080/pets/update/${pet.id}`, pet);
    else
      return this.http.post<Pet>('http://localhost:8080/pets/add', pet);
  }

  // ----- Mostrar Mascotas (READ) -----
  findAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>('http://localhost:8080/pets');
  }

  // ----- Mostrar Mascota (READ) -----
  findById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`http://localhost:8080/pets/${id}`);
  }

  // ----- Actualizar Estado de Mascota (PATCH) -----
  updateEstado(id: number, estado: boolean): Observable<void> {
    return this.http.patch<void>(`http://localhost:8080/pets/update-estado/${id}`, { estado });
  }

    // ----- Total de Mascotas -----
  countPets(): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/pets/count`);
  }

  // ----- Total de Mascotas Activas -----
  countPetsActivos(): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/pets/count/activos`);
  }

  // ----- Total de Mascotas Inactivas -----
  countPetsInactivos(): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/pets/count/inactivos`);
  }

  // ----- Comprobar Existencia de Mascota -----
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`http://localhost:8080/pets/${id}/exists`);
  }

}
