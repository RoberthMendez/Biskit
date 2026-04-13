import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientCL } from '../../../../../models/Client/client-cl';
import { ClientService } from '../../../../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form.component.html',
})
export class ClientFormComponent {
  @Input() clientId: number | null = null;

  constructor(
    private clientService: ClientService,
    private router: Router,
  ) {}

  formClient: ClientCL = new ClientCL();

  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingClientId: number | null = null;

  ngOnInit(): void {
    if (this.clientId) {
      this.formClient = this.clientService.findById(this.clientId);
    }
  }

  saveClient(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.formClient.nombre.trim()) {
      this.errorMessage = 'Nombre requerido';
      return;
    }
    if (!this.formClient.cedula.trim()) {
      this.errorMessage = 'Cédula requerida';
      return;
    }
    if (!this.formClient.correo.trim()) {
      this.errorMessage = 'Correo requerido';
      return;
    }
    if (!this.formClient.celular.trim()) {
      this.errorMessage = 'Teléfono requerido';
      return;
    }

    this.clientService.saveClient(this.formClient);

    if (this.clientId) {
      this.router.navigate(['/vet/clients']);
    } else {
      this.successMessage = 'Cliente guardado correctamente';
      this.formClient = new ClientCL();
    }
  }
}
