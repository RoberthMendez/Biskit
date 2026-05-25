import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Especie } from '../models/Pets/especie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EspeciesService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Especie[]> {
    return this.http.get<Especie[]>(`${environment.apiUrl}/especies`);
  }
}
