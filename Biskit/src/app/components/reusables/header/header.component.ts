import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { VetService } from '../../../services/vet.service';
import { ClientService } from '../../../services/client.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Admin } from '../../../models/Admin/admin';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, DeleteModalComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  nombreUsuario: string = '';
  idUsuario: number | null = null;
  rolUsuario: string | null = null;
  showLogoutModal = false;

  constructor(
    private adminService: AdminService,
    private vetService: VetService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.rolUsuario = this.normalizarRol(localStorage.getItem('authRole'));
    this.idUsuario = this.getIdFromCurrentUrl() ?? this.getStoredAuthId();

    const currentUrl = this.router.url;

    // Verificar coincidencia entre rol y ruta
    if (
      (currentUrl.startsWith('/admin') && this.rolUsuario !== 'ADMIN') ||
      (currentUrl.startsWith('/vet') && this.rolUsuario !== 'VET') ||
      (currentUrl.startsWith('/client') && this.rolUsuario !== 'CLIENT')
    ) {
      this.nombreUsuario = '';
      this.idUsuario = null;
      return;
    }

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
    this.idUsuario = this.extractUserId(user) ?? this.idUsuario;

    if (this.idUsuario != null) {
      localStorage.setItem('authId', String(this.idUsuario));
    }
  }

  private normalizarRol(rol: string | null): string | null {
    if (!rol) {
      return null;
    }

    const rolNormalizado = rol.toUpperCase();

    if (rolNormalizado === 'VETERINARIO') {
      return 'VET';
    }

    if (rolNormalizado === 'CLIENTE') {
      return 'CLIENT';
    }

    return rolNormalizado;
  }

  private clearUserDetails(): void {
    this.nombreUsuario = '';
    this.idUsuario = null;
  }

  private extractUserId(user: Admin | Vet | Client): number | null {
    const id = user.id;
    return typeof id === 'number' && Number.isFinite(id) ? id : null;
  }

  private getStoredAuthId(): number | null {
    const storedId = localStorage.getItem('authId');
    if (!storedId) {
      return null;
    }

    const id = Number(storedId);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  private getIdFromCurrentUrl(): number | null {
    const [, idSegment] =
      this.router.url.match(/^\/(?:admin|vet|client)\/(\d+)/) ?? [];
    if (!idSegment) {
      return null;
    }

    const id = Number(idSegment);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  adminRoute(segment: 'pets' | 'vets' | 'clients'): Array<string | number> {
    return this.idUsuario != null
      ? ['/admin', this.idUsuario, segment]
      : ['/admin'];
  }

  solicitarCerrarSesion(): void {
    this.showLogoutModal = true;
  }

  cerrarModalCerrarSesion(): void {
    this.showLogoutModal = false;
  }

  confirmarCerrarSesion(): void {
    this.cerrarModalCerrarSesion();
    this.cerrarSesion();
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authId');

    this.router.navigate(['/']);
  }
}
