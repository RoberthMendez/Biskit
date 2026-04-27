import { Component } from '@angular/core';
import { VolverComponent } from './volver/volver.component';
import { ImagenComponent } from './imagen/imagen.component';
import { ClientFormComponent } from './form/form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [VolverComponent, ClientFormComponent, ImagenComponent],
  templateUrl: './add-client.component.html',
})
export class AddClientComponent {
  clientId: number | null = null;
  basePath = '/vet/clients';
  returnRoute: string | Array<string | number> = '/vet/clients';

  constructor(private route: ActivatedRoute) {}

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
  }
}
