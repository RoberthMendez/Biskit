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

  saveClient(client: Client): void {
    if (client.id)
      this.http.put(`http://localhost:8080/vet/clients/update/${client.id}`, client).subscribe();
    else
      this.http.post('http://localhost:8080/vet/clients/add', client).subscribe();
  }
  
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>('http://localhost:8080/vet/clients');
  }

  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`http://localhost:8080/vet/clients/${id}`);
  }

  getPetsByClientId(clientId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`http://localhost:8080/vet/clients/${clientId}/pets`);
  }


}
