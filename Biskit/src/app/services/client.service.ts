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
    console.log('Guardando cliente:', client);
    if (client.id)
      return this.http.put<Client>(
        `https://biskitserver.onrender.com/clients/update/${client.id}`,
        client,
      );
    else
      return this.http.post<Client>(
        'https://biskitserver.onrender.com/clients/add',
        client,
      );
  }

  // ----- Mostrar Clientes (READ) -----
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>('https://biskitserver.onrender.com/clients');
  }

  // ----- Mostrar Cliente (READ) -----
  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`https://biskitserver.onrender.com/clients/${id}`);
  }

  // ----- Mostrar Mascotas por ID de Cliente (READ) -----
  getPetsByClientId(id: number): Observable<PetDTO[]> {
    return this.http.get<PetDTO[]>(`https://biskitserver.onrender.com/clients/${id}/pets`);
  }

  // ----- Eliminar Cliente (DELETE) -----
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`https://biskitserver.onrender.com/clients/delete/${id}`);
  }

  // ----- Total de Clientes -----
  countClients(): Observable<number> {
    return this.http.get<number>(`https://biskitserver.onrender.com/clients/count`);
  }

  // ----- Verificar existencia de Cliente por ID -----
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`https://biskitserver.onrender.com/clients/${id}/exists`);
  }

  getDetails(): Observable<Client> {
    return this.http.get<Client>(`https://biskitserver.onrender.com/clients/details`);
  }
}

