import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { VetService } from '../../../services/vet.service';
import { ClientService } from '../../../services/client.service';
import { Router, RouterLink } from '@angular/router';
import { Admin } from '../../../models/Admin/admin';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  nombreUsuario: string = '';
  idUsuario: number | null = null;
  rolUsuario: string | null = null;

  constructor(
    private adminService: AdminService,
    private vetService: VetService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.rolUsuario = localStorage.getItem('authRole');

    if (this.rolUsuario === 'VET' || this.rolUsuario === 'VETERINARIO') {
      this.rolUsuario = 'VET';
      this.vetService.getDetails().subscribe({
        next: (vet) => this.setUserDetails(vet),
        error: () => this.clearUserDetails(),
      });
    }
    if (this.rolUsuario === 'ADMIN') {
      this.adminService.getDetails().subscribe({
        next: (admin) => this.setUserDetails(admin),
        error: () => this.clearUserDetails(),
      });
    }
    if (this.rolUsuario === 'CLIENT' || this.rolUsuario === 'CLIENTE') {
      this.rolUsuario = 'CLIENT';
      this.clientService.getDetails().subscribe({
        next: (client) => this.setUserDetails(client),
        error: () => this.clearUserDetails(),
      });
    }
  }

  private setUserDetails(user: Admin | Vet | Client | null): void {
    if (!user) {
      this.clearUserDetails();
      return;
    }

    this.nombreUsuario = user.nombre ?? '';
    this.idUsuario = user.id ?? null;
  }

  private clearUserDetails(): void {
    this.nombreUsuario = '';
    this.idUsuario = null;
  }
}
