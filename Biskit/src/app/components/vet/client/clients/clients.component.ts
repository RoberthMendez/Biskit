// clients.component.ts
import { Component } from '@angular/core';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../models/Client/client';
import { ClientsHeaderComponent } from './clients-header/clients-header.component';
import { ClientsSearchComponent } from './clients-buscador/clients-buscador.component';
import { ClientsCardsComponent } from './clients-cards/clients-cards.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { TablaComponent } from '../../../reusables/tabla/tabla.component';
import {
  TablaActionClickEvent,
  TablaColumnaInput,
  TablaFilaClickEvent,
} from '../../../reusables/tabla/tabla.types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  imports: [ClientsHeaderComponent, ClientsSearchComponent, TablaComponent, ClientsCardsComponent, DeleteModalComponent]
})
export class ClientsComponent {

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  selectedId: number | null = null;
  showModal = false;
  vetId: string | null = null;

  public readonly columnasClient: TablaColumnaInput[] = [
    { header: 'Nombre', key: 'nombre', align: 'left' },
    { header: 'Cédula', key: 'cedula', align: 'left' },
    { header: 'Correo', key: 'correo', align: 'left' },
    { header: 'Celular', key: 'celular', align: 'left' },
    {
      header: 'Acciones',
      type: 'actions',
      align: 'right',
      actions: [
        {
          id: 'edit',
          label: 'Editar',
          icon: 'edit',
          showLabel: false,
          className:
            'flex items-center justify-center gap-2 rounded-lg border border-[#2B5392] bg-transparent px-3 py-2 text-[#2B5392] transition-colors duration-200 hover:bg-[#2B5392] hover:text-[#FBFAF8] lg:px-4',
        },
        {
          id: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          showLabel: false,
          className:
            'flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#B22222] bg-transparent px-3 py-2 text-[#B22222] transition-colors duration-200 hover:bg-[#B22222] hover:text-[#FBFAF8] lg:px-4',
        },
      ],
    },
  ];

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(){
    this.vetId = this.route.snapshot.paramMap.get('vetId');

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
       this.clientService.deleteClient(this.selectedId).subscribe(
        () => {
          this.clientService.findAll().subscribe(
            (clients) => {
              this.clients = clients;
              this.onSearch(this.searchTerm); 
            }
          );
        }
      );
    }
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }

  onRowClick(event: TablaFilaClickEvent): void {
    const client = this.extraerClient(event.row);
    if (!client?.id || !this.vetId) {
      return;
    }

    this.router.navigate(['/vet', this.vetId, 'clients', client.id]);
  }

  onActionClick(event: TablaActionClickEvent): void {
    const client = this.extraerClient(event.row);
    if (!client?.id || !this.vetId) {
      return;
    }

    if (event.actionId === 'edit') {
      this.router.navigate(['/vet', this.vetId, 'clients', 'update', client.id]);
      return;
    }

    if (event.actionId === 'delete') {
      this.openDelete(client.id);
    }
  }

  private extraerClient(row: unknown): Client | null {
    if (!row || typeof row !== 'object') {
      return null;
    }

    return row as Client;
  }
}