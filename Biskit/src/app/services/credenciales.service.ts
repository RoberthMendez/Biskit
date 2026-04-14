import { Injectable } from '@angular/core';
import { Credenciales } from '../models/Credenciales/credenciales';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  id: number | null;
  tipo: 'CLIENTE' | 'VETERINARIO' | 'CREDENCIALES_INVALIDAS';
}

@Injectable({
  providedIn: 'root',
})
export class CredencialesService {
  constructor(private http: HttpClient) {}

  // ----- Autenticación de Usuario (LOGIN) -----
  authenticate(credenciales: Credenciales): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:8080/login',
      credenciales,
    );
  }

  addCredenciales(credenciales: Credenciales) {
    return this.http.post('http://localhost:8080/register', credenciales);
  }
}
