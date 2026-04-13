// clients.component.ts
import { Component } from '@angular/core';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/Client/client';
import { ClientsHeaderComponent } from './clients-header/clients-header.component';
import { ClientsSearchComponent } from './clients-buscador/clients-buscador.component';
import { ClientsTableComponent } from './clients-tabla/clients-tabla.component';
import { ClientsCardsComponent } from './clients-cards/clients-cards.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { FooterComponent } from '../../../reusables/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [ClientsHeaderComponent, ClientsSearchComponent, ClientsTableComponent, ClientsCardsComponent, DeleteModalComponent, FooterComponent]
})
export class ClientsComponent {

  clients: Client[] = [];
  selectedId: number | null = null;
  showModal = false;

  constructor(private clientService: ClientService) {
    this.clients = this.clientService.getClients();
  }

  openDelete(id: number) {
    this.selectedId = id;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.selectedId !== null) {
      this.clientService.deleteClient(this.selectedId);
      this.clients = this.clientService.getClients();
    }
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }
}