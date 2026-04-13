// clients.component.ts
import { Component } from '@angular/core';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/Client/client';
import { ClientsHeaderComponent } from './clients-header/clients-header.component';
import { ClientsSearchComponent } from './clients-buscador/clients-buscador.component';
import { ClientsTableComponent } from './clients-tabla/clients-tabla.component';
import { ClientsCardsComponent } from './clients-cards/clients-cards.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@Component({
  standalone: true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [ClientsHeaderComponent, ClientsSearchComponent, ClientsTableComponent, ClientsCardsComponent, DeleteModalComponent]
})
export class ClientsComponent {

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  selectedId: number | null = null;
  showModal = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(){
    this.clientService.findAll().subscribe(
      (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
      }
    )
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
    
    if (this.searchTerm === '') {
      this.filteredClients = this.clients;
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.nombre.toLowerCase().includes(this.searchTerm) ||
        client.cedula.toLowerCase().includes(this.searchTerm) ||
        client.correo.toLowerCase().includes(this.searchTerm) ||
        client.celular.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  openDelete(id: number) {
    this.selectedId = id;
    this.showModal = true;
  }

  confirmDelete() {
    if (this.selectedId !== null) {
      this.clientService.deleteClient(this.selectedId);
      // this.clients = this.clientService.getClients();
    }
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }
}