import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CredencialesService } from '../../../services/credenciales.service';
import { Credenciales } from '../../../models/Credenciales/credenciales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      usuario: this.usuario,
      password: this.contrasena,
    };

    this.credencialesService.authenticate(credenciales).subscribe({
      next: (response) => {
        if (response.id != null) {
          localStorage.setItem('authRole', response.tipo);
          localStorage.setItem('authId', String(response.id));
        }

        if (response.tipo === 'CLIENTE') {
          if (response.id) {
            this.router.navigate(['/client', response.id]);
          } else {
            this.error = 'No se pudo obtener el id del cliente.';
          }
          return;
        }

        if (response.tipo === 'VETERINARIO') {
          this.router.navigate(['/vet', response.id]);
          return;
        }

        if (response.tipo === 'ADMIN') {
          this.router.navigate(['/admin', response.id]);
          return;
        }

        if (response.tipo === 'CREDENCIALES_INVALIDAS') {
          this.error = 'Usuario o contrasena incorrectos.';
          return;
        }

        console.log('Autenticación exitosa:', response);
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
