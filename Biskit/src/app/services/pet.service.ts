import { Injectable } from '@angular/core';
import { PetCl } from '../models/Pets/Pet/pet-cl';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  constructor(
    private http: HttpClient
  ) {}

  findAll(): Observable<PetCl[]> {
    return this.http.get<PetCl[]>('http://localhost:8080/vet/pets');
  }

  findById(id: number): Observable<PetCl> {
    return this.http.get<PetCl>(`http://localhost:8080/vet/pets/${id}`);
  }

  updateEstado(id: number, estado: boolean): void {
    let petUpdate = new PetCl();
    petUpdate.id = id;
    petUpdate.estado = estado;
    this.http.patch(`http://localhost:8080/vet/pets/${id}/update-estado`, petUpdate).subscribe();
  }

  savePet(pet: PetCl): void {
    if (pet.id) {
      this.http.put(`http://localhost:8080/vet/pets/update/${pet.id}`, pet).subscribe();
    } else {
      this.http.post('http://localhost:8080/vet/pets/add', pet).subscribe();
    }
  }

}
