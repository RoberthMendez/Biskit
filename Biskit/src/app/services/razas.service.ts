import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Raza } from '../models/Pets/raza';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RazasService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Raza[]> {
    return this.http.get<Raza[]>(`${environment.apiUrl}/razas`);
  }

  addRaza(raza: Raza): Observable<Raza> {
    return this.http.post<Raza>(`${environment.apiUrl}/razas/add`, raza);
  }
}
