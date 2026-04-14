import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Raza } from '../models/Pets/raza';

@Injectable({
  providedIn: 'root'
})
export class RazasService {

  constructor( private http: HttpClient) { }

  findAll(): Observable<Raza[]> {
    return this.http.get<Raza[]>('http://localhost:8080/razas');
  }

  add(nombre: string, especieId: number): Observable<Raza> {
    return this.http.post<Raza>('http://localhost:8080/razas', {nombre, especieId});
  }
}
