import { Injectable } from '@angular/core';
import { Vet } from '../models/Vets/vet-cl';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../models/Pets/pet';

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

  // ----- Eliminar Veterinario (DELETE) -----
  deleteVet(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vets/delete/${id}`);
  }

  // ----- Actualizar Estado de Mascota (PATCH) -----
  updateEstado(id: number, estado: boolean): Observable<void> {
    return this.http.patch<void>(`http://localhost:8080/vets/update-estado/${id}`, { estado });
  }


  // ----- Numero de Tratamientos Realizados por un Veterinario -----
  countTratamientosByVet(vetId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/vets/${vetId}/tratamientos/count`);
  }

  //Comprobar si el id de vet existe
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`http://localhost:8080/vets/${id}/exists`); 
  }

}
