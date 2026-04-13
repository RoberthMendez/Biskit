import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CredencialesService } from '../../../services/credenciales.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
})
export class LoginFormComponent {
  constructor(private credencialesService: CredencialesService) {}

  usuario = '';
  contrasena = '';

  error: string | null = null;

  onSubmit(): void {
    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.error = 'Completa usuario y contrasena.';
      return;
    }

    const isValid = this.credencialesService.checkCredenciales(this.usuario, this.contrasena);

    if (!isValid) {
      this.error = 'Usuario o contrasena incorrectos.';
      return;
    }

    this.error = null;
  }
}

