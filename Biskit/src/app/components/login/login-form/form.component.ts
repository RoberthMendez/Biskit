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
  mostrarContrasena = false;

  error: string | null = null;
  loading = false;

  onSubmit(): void {
    if (this.loading) {
      return;
    }

    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.error = 'Completa usuario y contrasena.';
      return;
    }

    const credenciales: Credenciales = {
      username: this.usuario,
      password: this.contrasena,
    };

    this.loading = true;

    this.credencialesService.authenticate(credenciales).subscribe({
      next: (response) => {
        this.loading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('authRole', response.rol);

        const responseWithId = response as typeof response & { id?: number };
        if (responseWithId.id != null) {
          localStorage.setItem('authId', String(responseWithId.id));
        }

        if (response.rol === 'CLIENT') {
          this.router.navigate(['/client']);
          return;
        }

        if (response.rol === 'VET') {
          this.router.navigate(['/vet']);
          return;
        }

        if (response.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
          return;
        }
      },
      error: (error) => {
        this.loading = false;
        const tipo = error.error?.tipo;

        if (tipo === 'VETERINARIO_INACTIVO') {
          this.error = 'Cuenta de veterinario inactiva.';
        } else if (error.status === 0) {
          this.error = 'No se pudo conectar con el servidor.';
        } else if (error.status === 500) {
          this.error = 'Error interno del servidor';
        } else if (error.error?.mensaje === 'Usuario o contraseña incorrecta') {
          this.error = error.error.mensaje;
        } else {
          this.error = 'Ocurrió un error inesperado.';
        }
      },
    });

    this.error = null;
  }
}
