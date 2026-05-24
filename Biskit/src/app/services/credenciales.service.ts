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

  // ----- AutenticaciÃ³n de Usuario (LOGIN) -----
  authenticate(credenciales: Credenciales): Observable<LoginDto> {
    return this.http.post<LoginDto>(
    'https://biskitserver.onrender.com/login/nuevo',
    credenciales
  );
}

  addCredenciales(credenciales: Credenciales) {
    return this.http.post('https://biskitserver.onrender.com/register', credenciales);
  }

  // ----- Restablecimiento de ContraseÃ±a -----
  resetPassword(
    idUsuario: number,
    credenciales: Credenciales,
  ): Observable<void> {
    return this.http.put<void>(
      `https://biskitserver.onrender.com/login/${idUsuario}/reset-password`,
      credenciales,
    );
  }

  // ----- Enviar Correo para Cambiar ContraseÃ±a -----
  forgotPassword(correo: String): Observable<void> {
    return this.http.post<void>(
      `https://biskitserver.onrender.com/login/forgot-password`,
      correo,
    );
  }
}

