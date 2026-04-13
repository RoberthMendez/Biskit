import { Injectable } from '@angular/core';
import { Client } from '../models/Client/client';
import { Pet } from '../models/Pets/pet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  constructor( private http: HttpClient) {}

  private clients: Client[] = [];

  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:8080/vet/clients');
  }

  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`http://localhost:8080/vet/clients/${id}`);
  }

  getPetsByClientId(clientId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`http://localhost:8080/vet/clients/${clientId}/pets`);
  }

  addClient(client: Client): void {
    this.clients.push(client);
  }

  deleteClient(clientId: number): void {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  saveClient(client: Client): void {
    if (client.id) {
      const index = this.clients.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        this.clients[index] = client;
      }
    } else {
      // Busca el id máximo de los clientes y le suma 1
      const nuevoId =
        this.clients.length > 0
          ? Math.max(...this.clients.map((c) => c.id || 0)) + 1
          : 1;
      client.id = nuevoId;
      this.clients.push(client);
    }
  }
}
