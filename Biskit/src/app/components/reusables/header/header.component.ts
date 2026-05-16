import { Component, Input } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { VetService } from '../../../services/vet.service';
import { ClientService } from '../../../services/client.service';
import { Router, RouterLink } from '@angular/router';

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

    const currentUrl = this.router.url;

    // Verificar coincidencia entre rol y ruta
    if (
      (currentUrl.startsWith('/admin') && this.rolUsuario !== 'ADMIN') ||
      (currentUrl.startsWith('/vet') && this.rolUsuario !== 'VET') ||
      (currentUrl.startsWith('/client') && this.rolUsuario !== 'CLIENT')
    ) {

      localStorage.removeItem('token');
      localStorage.removeItem('authRole');

      return;
    }

    if (this.rolUsuario === 'VET') {
      this.vetService.getDetails().subscribe((vet) => {
        this.nombreUsuario = vet.nombre;
        this.idUsuario = vet.id!;
      });
    }
    if (this.rolUsuario === 'ADMIN') {
      this.adminService.getDetails()
        .subscribe((admin) => {
          this.nombreUsuario = admin.nombre;
          this.idUsuario = admin.id!;
        });
    }
    if (this.rolUsuario === 'CLIENT') {
      this.clientService.getDetails().subscribe((client) => {
        this.nombreUsuario = client.nombre;
        this.idUsuario = client.id!;
      });
    }
  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('authRole');

    this.router.navigate(['/']);
  }

}
