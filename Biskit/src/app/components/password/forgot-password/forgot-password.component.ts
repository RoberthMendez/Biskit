import { Component } from '@angular/core';
import { ImageComponent } from '../../login/login-image/image.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CredencialesService } from '../../../services/credenciales.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ImageComponent, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  constructor(
    private credencialesService: CredencialesService
  ) {}

  usuario: string = '';
  error: string = '';
  success: boolean = false;
  loading: boolean = false;

  onSubmit(): void {
    this.error = '';
    this.success = false;

    if (!this.usuario.trim()) {
      this.error = 'Por favor ingresa tu usuario.';
      return;
    }

    this.loading = true;

    this.credencialesService.forgotPassword(this.usuario).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al restablecer la contraseña';
        this.loading = false;
      }
    });

  }

  

}
