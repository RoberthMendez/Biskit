import { Component } from '@angular/core';
import { Client } from '../../../../models/Client/client';
import { ClientService } from '../../../../services/client.service';
import { VetService } from '../../../../services/vet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ClientHeaderComponent } from './client-header/client-header.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { PetsSectionComponent } from './pets-section/pets-section.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  selector: 'app-info-client',
  templateUrl: './info-client.component.html',
  imports: [
    ClientHeaderComponent,
    ClientDetailsComponent,
    PetsSectionComponent,
    DeleteModalComponent,
  ],
})
export class InfoClientComponent {

  client: Client = new Client();
  vetId: number | null = null;

  constructor(
    private clientService: ClientService,
    private vetService: VetService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.comprobarIds();
    
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
            }))
          )
        )
      )
      .subscribe(({ client, pets }) => {
        this.client = client;
        this.client.pets = pets;
      });
  }

  goToClients(): void {
    this.router.navigate(['/vet/clients']);
  }

  showModal = false;
  selectedDeleteId: number | null = null;

  openDeleteModal(clientId?: number) {
    this.selectedDeleteId = clientId ?? null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDeleteId = null;
  }

  confirmDelete() {
    if (this.selectedDeleteId != null) {
      this.clientService.deleteClient(this.selectedDeleteId).subscribe(
        () => {
          this.router.navigate(['/vet/clients']);
        }
      );
      return;
    }

    this.closeModal();
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

    const clientIdParam = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.existsById(clientIdParam).subscribe({
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
