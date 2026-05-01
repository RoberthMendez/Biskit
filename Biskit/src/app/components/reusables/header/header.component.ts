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

  constructor(
    private adminService: AdminService,
    private vetService: VetService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit() {
    const authRole = localStorage.getItem('authRole');
    const authId = Number(localStorage.getItem('authId'));
    if (authRole === 'VETERINARIO') {
      this.vetService.findById(authId).subscribe((vet) => {
        this.nombreUsuario = vet.nombre;
      });
    }
    if (authRole === 'ADMIN') {
      this.adminService.getAdminById(String(authId)).subscribe((admin) => {
        this.nombreUsuario = admin.nombre;
      });
    }
    if (authRole === 'CLIENTE') {
      this.clientService.findById(authId).subscribe((client) => {
        this.nombreUsuario = client.nombre;
      });
    }
  }
}
