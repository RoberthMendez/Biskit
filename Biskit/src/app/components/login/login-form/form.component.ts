import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CredencialesService } from '../../../services/credenciales.service';
import { Credenciales } from '../../../models/Credenciales/credenciales';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.component.html',
})
export class LoginFormComponent {
  constructor(
    private credencialesService: CredencialesService,
    private router: Router,
  ) {}

  usuario = '';
  contrasena = '';

  error: string | null = null;

  onSubmit(): void {
    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.error = 'Completa usuario y contrasena.';
      return;
    }

    const credenciales: Credenciales = {
      username: this.usuario,
      password: this.contrasena,
    };

    this.credencialesService.authenticate(credenciales).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('authRole', data.rol)
      },
      error: (error) => {
        const tipo = error.error?.tipo;

        if (tipo === 'VETERINARIO_INACTIVO') {
          this.error = 'Cuenta de veterinario inactiva.';
        } else if (error.status === 0) {
          this.error = 'No se pudo conectar con el servidor.';
        } else if (error.status === 500) {
          this.error = 'Error interno del servidor';
        } else {
          this.error = 'Usuario o contrasena incorrectos.';
        }
      },
    });

    this.error = null;
  }
}
