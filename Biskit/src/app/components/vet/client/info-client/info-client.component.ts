import { Component } from '@angular/core';
import { Client } from '../../../../models/Client/client';
import { ClientService } from '../../../../services/client.service';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ClientHeaderComponent } from './client-header/client-header.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { PetsSectionComponent } from './pets-section/pets-section.component';
import { DeleteModalComponent } from '../../../reusables/delete-modal/delete-modal.component';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';
import { PetDTO } from '../../../../models/dtos/pet-dto';

@Component({
  selector: 'app-info-client',
  standalone: true,
  templateUrl: './info-client.component.html',
  imports: [
    ClientHeaderComponent,
    ClientDetailsComponent,
    PetsSectionComponent,
    DeleteModalComponent,
    BackButtonComponent,
  ],
})
export class InfoClientComponent {
  client: Client = new Client();
  pets: PetDTO[] = [];
  vetId: number | null = null;
  basePath = '/vet/clients';
  clientsRoute = '/vet/clients';

  constructor(
    private clientService: ClientService,
    private vetService: VetService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const isAdminView = routePath.startsWith('admin/');
    const contextParam = isAdminView ? 'idAdmin' : 'vetId';
    const contextId = this.route.snapshot.paramMap.get(contextParam) ?? '';

    if (contextId) {
      this.basePath = `/${isAdminView ? 'admin' : 'vet'}/${contextId}/clients`;
      this.clientsRoute = this.basePath;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const clientId = id ? Number(id) : 0;

    this.clientService
      .findById(clientId)
      .pipe(
        switchMap((client) =>
          this.clientService.getPetsByClientId(client.id ?? clientId).pipe(
            map((pets) => ({
              client,
              pets: pets ?? [],
            })),
          ),
        ),
      )
      .subscribe(({ client, pets }) => {
        this.client = client;
        this.pets = pets;
      });
  }

  goToClients(): void {
    this.router.navigateByUrl(this.clientsRoute);
  }

  showModal = false;
  selectedDeleteId: number | null = null;
  deleteSuccessMessage = '';
  shouldNavigateAfterDelete = false;

  openDeleteModal(clientId?: number) {
    this.selectedDeleteId = clientId ?? null;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;
    this.showModal = true;
  }

  closeModal() {
    const shouldNavigate = this.shouldNavigateAfterDelete;
    this.showModal = false;
    this.selectedDeleteId = null;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;

    if (shouldNavigate) {
      this.router.navigateByUrl(this.clientsRoute);
    }
  }

  confirmDelete() {
    if (this.selectedDeleteId != null) {
      this.clientService.deleteClient(this.selectedDeleteId).subscribe(() => {
        this.shouldNavigateAfterDelete = true;
        this.deleteSuccessMessage = 'Cliente eliminado correctamente';
      });
      return;
    }

    this.closeModal();
  }
}
