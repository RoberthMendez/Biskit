import { Injectable } from '@angular/core';
import { Pet } from '../models/Pets/pet';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetDTO } from '../models/dtos/pet-dto';
import { Client } from '../models/Client/client';
import { ItemTratamientoDto } from '../models/dtos/item-tratamiento-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  constructor(private http: HttpClient) {}

  // ----- Crear Mascota (CREATE) -----
  savePet(pet: Pet, citaId: number): Observable<Pet> {
    let params = new HttpParams();
    if (citaId != 0) params = params.set('citaId', citaId.toString());

    if (pet.id) {
      return this.http.put<Pet>(
        `${environment.apiUrl}/pets/update/${pet.id}`,
        pet,
      );
    }

    return this.http.post<Pet>(`${environment.apiUrl}/pets/add`, pet, {
      params,
    });
  }

  // ----- Mostrar Mascotas (READ) -----
  findAll(): Observable<PetDTO[]> {
    return this.http.get<PetDTO[]>(`${environment.apiUrl}/pets`);
  }

  // ----- Mostrar Mascota (READ) -----
  findById(id: number): Observable<PetDTO> {
    return this.http.get<PetDTO>(`${environment.apiUrl}/pets/${id}`);
  }

  // ----- Mostrar DueÃ±o de la Mascota (READ) -----
  getPetOwner(id: number): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/pets/${id}/owner`);
  }

  // ----- Mostrar Tratamientos de una Mascota (READ) -----
  getPetTratamientos(id: number): Observable<ItemTratamientoDto[]> {
    return this.http.get<ItemTratamientoDto[]>(
      `${environment.apiUrl}/pets/${id}/tratamientos`,
    );
  }

  // ----- Actualizar Estado de Mascota (PATCH) -----
  updateEstado(id: number): Observable<boolean> {
    return this.http.patch<boolean>(
      `${environment.apiUrl}/pets/update-estado/${id}`,
      null,
    );
  }

  // ----- Total de Mascotas -----
  countPets(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/pets/count`);
  }

  // ----- Total de Mascotas Activas -----
  countPetsActivos(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/pets/count/activos`);
  }

  // ----- Total de Mascotas Inactivas -----
  countPetsInactivos(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/pets/count/inactivos`);
  }

  // ----- Comprobar Existencia de Mascota -----
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/pets/${id}/exists`);
  }
}
function newHttpParams() {
  throw new Error('Function not implemented.');
}
