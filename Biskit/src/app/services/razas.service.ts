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
    return this.http.get<Raza[]>('https://biskitserver.onrender.com/razas');
  }

  addRaza(raza: Raza): Observable<Raza> {
    return this.http.post<Raza>('https://biskitserver.onrender.com/razas/add', raza);
  }
}

