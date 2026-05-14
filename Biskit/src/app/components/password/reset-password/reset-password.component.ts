import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CredencialesService } from '../../../services/credenciales.service';
import { Credenciales } from '../../../models/Credenciales/credenciales';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private credentialService: CredencialesService
  ) {}

  id: number | null = null;
  correo: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    const correoParam = this.route.snapshot.queryParamMap.get('correo');
    this.correo = correoParam ?? '';
  }

  resetPassword(): void {

    this.errorMessage = null;
    this.successMessage = null;

    if (!this.nuevaPassword.trim()) {
      this.errorMessage = 'Nueva contraseña requerida';
      return;
    }
    if (!this.confirmarPassword.trim()) {
      this.errorMessage = 'Confirmar contraseña requerida';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const credenciales = new Credenciales(undefined, this.correo, this.nuevaPassword);

    this.credentialService.resetPassword(this.id!, credenciales).subscribe({
      next: () => {
        this.successMessage = 'Contraseña restablecida exitosamente';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 600);
      },
      error: () => {
        this.errorMessage = 'Error al restablecer la contraseña';
      }
    });

  }

}
