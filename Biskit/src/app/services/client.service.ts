import { Injectable } from '@angular/core';
import { Client } from '../models/Client/client';
import { PetDTO } from '../models/dtos/pet-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  // ----- Crear y Actualizar Cliente (CREATE/UPDATE) -----
  saveClient(client: Client): Observable<Client> {
    if (client.id)
      return this.http.put<Client>(
        `http://localhost:8080/clients/update/${client.id}`,
        client,
      );
    else
      return this.http.post<Client>(
        'http://localhost:8080/clients/add',
        client,
      );
  }

  // ----- Mostrar Clientes (READ) -----
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:8080/clients');
  }

  // ----- Mostrar Cliente (READ) -----
  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`http://localhost:8080/clients/${id}`);
  }

  // ----- Mostrar Mascotas por ID de Cliente (READ) -----
  getPetsByClientId(id: number): Observable<PetDTO[]> {
    return this.http.get<PetDTO[]>(`http://localhost:8080/clients/${id}/pets`);
  }

  // ----- Eliminar Cliente (DELETE) -----
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/clients/delete/${id}`);
  }

  // ----- Total de Clientes -----
  countClients(): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/clients/count`);
  }

  // ----- Verificar existencia de Cliente por ID -----
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`http://localhost:8080/clients/${id}/exists`);
  }

  getDetails(): Observable<Client> {
    return this.http.get<Client>(`http://localhost:8080/clients/details`);
  }
}
