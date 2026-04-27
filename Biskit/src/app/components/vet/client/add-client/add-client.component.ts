import { Component } from '@angular/core';
import { ImagenComponent } from './imagen/imagen.component';
import { ClientFormComponent } from './form/form.component';
import { ActivatedRoute } from '@angular/router';
import { VetService } from '../../../../services/vet.service';
import { ClientService } from '../../../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ClientFormComponent, ImagenComponent],
  templateUrl: './add-client.component.html',
})
export class AddClientComponent {
  clientId: number | null = null;
  vetId: number | null = null;
  basePath = '/vet/clients';
  returnRoute: string | Array<string | number> = '/vet/clients';

  constructor(
    private route: ActivatedRoute,
    private vetService: VetService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const isAdminView = routePath.startsWith('admin/');
    const contextParam = isAdminView ? 'idAdmin' : 'vetId';
    const contextId = this.route.snapshot.paramMap.get(contextParam) ?? '';

    if (contextId) {
      this.basePath = `/${isAdminView ? 'admin' : 'vet'}/${contextId}`;
      this.returnRoute = [this.basePath, 'clients'];
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.clientId = id ? Number(id) : null;

    this.comprobarIds();
  }

  private comprobarIds() {
    const vetIdParam = Number(this.route.snapshot.paramMap.get('vetId'));

    if (vetIdParam) {
      this.vetService.existsById(vetIdParam).subscribe({
        next: () => {
          this.vetId = vetIdParam;
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
  }
}
