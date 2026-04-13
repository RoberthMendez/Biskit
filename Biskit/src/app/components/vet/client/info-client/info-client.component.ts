import { Component } from '@angular/core';
import { Client } from '../../../../models/Client/client';
import { ClientService } from '../../../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  client!: Client;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.client =
      this.clientService.findById(id ? Number(id) : 0) || new Client();
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
      this.clientService.deleteClient(this.selectedDeleteId);
      this.router.navigate(['/vet/clients']);
      return;
    }

    this.closeModal();
  }
}
