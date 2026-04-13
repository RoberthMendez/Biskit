import { Injectable } from '@angular/core';
import { Client } from '../models/Client/client';
import { Pet } from '../models/Pets/pet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  constructor( private http: HttpClient ) {}

  // ----- Crear y Actualizar Cliente (CREATE/UPDATE) -----
  saveClient(client: Client): Observable<Client> {
    if (client.id)
      return this.http.put<Client>(`http://localhost:8080/vet/clients/update/${client.id}`, client);
    else
      return this.http.post<Client>('http://localhost:8080/vet/clients/add', client);
  }
  
  // ----- Mostrar Clientes (READ) -----
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:8080/vet/clients');
  }

  // ----- Mostrar Cliente (READ) -----
  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`http://localhost:8080/vet/clients/${id}`);
  }

  // ----- Mostrar Mascotas por ID de Cliente (READ) -----
  getPetsByClientId(id: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`http://localhost:8080/vet/clients/${id}/pets`);
  }

  // ----- Eliminar Cliente (DELETE) -----
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vet/clients/delete/${id}`);
  }


}
