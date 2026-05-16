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

    if (this.rolUsuario === 'VET') {
      this.vetService.getDetails().subscribe((vet) => {
        this.nombreUsuario = vet.nombre;
      });
    }
    if (this.rolUsuario === 'ADMIN') {
      this.adminService.getDetails()
        .subscribe((admin) => {
          this.nombreUsuario = admin.nombre;
        });
    }
    if (this.rolUsuario === 'CLIENT') {
      this.clientService.getDetails().subscribe((client) => {
        this.nombreUsuario = client.nombre;
      });
    }
  }
}
