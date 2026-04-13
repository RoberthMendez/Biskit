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
  constructor(
    private http: HttpClient
  ) {}

  findAll(): Observable<Pet[]> {
    return this.http.get<Pet[]>('http://localhost:8080/vet/pets');
  }

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

  savePet(pet: Pet): void {
    if (pet.id) {
      this.http.put(`http://localhost:8080/vet/pets/update/${pet.id}`, pet).subscribe();
    } else {
      this.http.post('http://localhost:8080/vet/pets/add', pet).subscribe();
    }
  }

}
