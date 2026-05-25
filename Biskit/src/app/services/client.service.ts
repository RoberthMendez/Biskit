import { Injectable } from '@angular/core';
import { Client } from '../models/Client/client';
import { PetDTO } from '../models/dtos/pet-dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  // ----- Crear y Actualizar Cliente (CREATE/UPDATE) -----
  saveClient(client: Client): Observable<Client> {
    console.log('Guardando cliente:', client);
    if (client.id)
      return this.http.put<Client>(
        `${environment.apiUrl}/clients/update/${client.id}`,
        client,
      );
    else
      return this.http.post<Client>(
        `${environment.apiUrl}/clients/add`,
        client,
      );
  }

  // ----- Mostrar Clientes (READ) -----
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/clients`);
  }

  // ----- Mostrar Cliente (READ) -----
  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/clients/${id}`);
  }

  // ----- Mostrar Mascotas por ID de Cliente (READ) -----
  getPetsByClientId(id: number): Observable<PetDTO[]> {
    return this.http.get<PetDTO[]>(`${environment.apiUrl}/clients/${id}/pets`);
  }

  // ----- Eliminar Cliente (DELETE) -----
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/clients/delete/${id}`);
  }

  // ----- Total de Clientes -----
  countClients(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/clients/count`);
  }

  // ----- Verificar existencia de Cliente por ID -----
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/clients/${id}/exists`);
  }

  getDetails(): Observable<Client> {
    return this.http.get<Client>(`${environment.apiUrl}/clients/details`);
  }
}
