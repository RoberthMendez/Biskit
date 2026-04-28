import { Component } from '@angular/core';
import { ImagenComponent } from './imagen/imagen.component';
import { ClientFormComponent } from './form/form.component';
import { ActivatedRoute } from '@angular/router';
import { VetService } from '../../../../services/vet.service';
import { ClientService } from '../../../../services/client.service';
import { AdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ClientFormComponent, ImagenComponent, BackButtonComponent],
  templateUrl: './add-client.component.html',
})
export class AddClientComponent {
  clientId: number | null = null;
  vetId: number | null = null;
  basePath = '/vet/clients';
  returnRoute: string | Array<string | number> = '/vet/clients';
  backLink: string | Array<string | number> = '/vet/clients';
  backLabel = 'Lista de Clientes';

  constructor(
    private route: ActivatedRoute,
    private vetService: VetService,
    private adminService: AdminService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const isAdminView = routePath.startsWith('admin/');
    const contextParam = isAdminView ? 'idAdmin' : 'vetId';
    const contextId = this.route.snapshot.paramMap.get(contextParam) ?? '';
    const fromDetail = this.route.snapshot.queryParamMap.get('from') === 'detail';

    if (contextId) {
      this.basePath = `/${isAdminView ? 'admin' : 'vet'}/${contextId}`;
      this.returnRoute = [this.basePath, 'clients'];
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.clientId = id ? Number(id) : null;

    this.updateBackNavigation(fromDetail);
    this.comprobarIds();
  }

  private updateBackNavigation(fromDetail = false): void {
    if (this.clientId != null && fromDetail) {
      this.backLink = [this.basePath, 'clients', this.clientId];
      this.backLabel = 'Detalle de Cliente';
      this.returnRoute = [this.basePath, 'clients', this.clientId];
      return;
    }

    this.backLink = [this.basePath, 'clients'];
    this.backLabel = 'Lista de Clientes';
  }

  private comprobarIds() {
    const vetIdParam = Number(this.route.snapshot.paramMap.get('vetId'));

    if (vetIdParam) {
      this.vetService.existsById(vetIdParam).subscribe({
        next: () => {
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Veterinario no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }

    if (this.clientId) {
      this.clientService.existsById(this.clientId).subscribe({
        next: () => {},
        error: (error) => {
          const mensaje = error.error?.detalle || 'Cliente no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }

    const adminIdParam = Number(this.route.snapshot.paramMap.get('idAdmin'));
    if (adminIdParam) {
      this.adminService.existsById(adminIdParam).subscribe({
        next: () => {
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Administrador no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }
  }
}
