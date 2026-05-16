import { Injectable } from '@angular/core';
import { Credenciales } from '../models/Credenciales/credenciales';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResCredencialesDto } from '../models/dtos/res-credenciales-dto';
import { LoginDto } from '../models/dtos/login-dto';

@Injectable({
  providedIn: 'root',
})
export class CredencialesService {
  constructor(private http: HttpClient) {}

  // ----- Autenticación de Usuario (LOGIN) -----
  authenticate(credenciales: Credenciales): Observable<LoginDto> {
    return this.http.post<LoginDto>(
    'http://localhost:8080/login/nuevo',
    credenciales
  );
}

  addCredenciales(credenciales: Credenciales) {
    return this.http.post('http://localhost:8080/register', credenciales);
  }

  // ----- Restablecimiento de Contraseña -----
  resetPassword(
    idUsuario: number,
    credenciales: Credenciales,
  ): Observable<void> {
    return this.http.put<void>(
      `http://localhost:8080/login/${idUsuario}/reset-password`,
      credenciales,
    );
  }

  // ----- Enviar Correo para Cambiar Contraseña -----
  forgotPassword(correo: String): Observable<void> {
    return this.http.post<void>(
      `http://localhost:8080/login/forgot-password`,
      correo,
    );
  }
}
