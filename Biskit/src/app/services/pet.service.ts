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
      return this.http.put<Pet>(`http://localhost:8080/vet/pets/update/${pet.id}`, pet);
    else
      return this.http.post<Pet>('http://localhost:8080/vet/pets/add', pet);
  }

  // ----- Mostrar Mascotas (READ) -----
  findAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>('http://localhost:8080/vet/pets');
  }

  // ----- Mostrar Mascota (READ) -----
  findById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`http://localhost:8080/vet/pets/${id}`);
  }

  // updateEstadoRequest(id: number, estado: boolean): Observable<UpdateEstadoResponse> {
  //   let petUpdate = new Pet();
  //   petUpdate.id = id;
  //   petUpdate.estado = estado;
  //   return this.http.patch<UpdateEstadoResponse>(`http://localhost:8080/vet/pets/${id}/update-estado`, petUpdate);
  // }

  // updateEstado(id: number, estado: boolean): void {
  //   this.updateEstadoRequest(id, estado).subscribe();
  // }


}
