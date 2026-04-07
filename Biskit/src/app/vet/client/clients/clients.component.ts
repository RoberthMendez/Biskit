// clients.component.ts
import { Component } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { ClientCL } from '../../../modelo/Client/client-cl';
import { ClientsHeaderComponent } from './components/clients-header/clients-header.component';
import { ClientsSearchComponent } from './components/clients-buscador/clients-buscador.component';
import { ClientsTableComponent } from './components/clients-tabla/clients-tabla.component';
import { ClientsCardsComponent } from './components/clients-cards/clients-cards.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { FooterComponent } from '../../../reusables/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [ClientsHeaderComponent, ClientsSearchComponent, ClientsTableComponent, ClientsCardsComponent, DeleteModalComponent, FooterComponent]
})
export class ClientsComponent {

  clients: ClientCL[] = [];
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