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
  isAdminView = false;
  basePath = '/vet/clients';
  returnRoute: string | Array<string | number> = ['/vet', 'clients'];
  backLink: string | Array<string | number> = ['/vet', 'clients'];
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
    this.isAdminView = routePath.startsWith('admin/');
    const basePath = this.isAdminView ? '/admin' : '/vet';

    const fromDetail =
      this.route.snapshot.queryParamMap.get('from') === 'detail';

    this.basePath = basePath;
    this.returnRoute = [basePath, 'clients'];

    const id = this.route.snapshot.paramMap.get('id');
    this.clientId = id ? Number(id) : null;

    this.updateBackNavigation(basePath, fromDetail);
  }

  private updateBackNavigation(basePath: string, fromDetail = false): void {
    if (this.clientId != null && fromDetail) {
      this.backLink = [basePath, 'clients', this.clientId];
      this.backLabel = 'Detalle de Cliente';
      this.returnRoute = [basePath, 'clients', this.clientId];
      return;
    }

    this.backLink = [basePath, 'clients'];
    this.backLabel = 'Lista de Clientes';
  }
}
