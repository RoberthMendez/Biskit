import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VetService } from '../../../services/vet.service';
import { PetService } from '../../../services/pet.service';
import { ClientService } from '../../../services/client.service';
import { TratamientoService } from '../../../services/tratamiento.service';
import { ActivatedRoute } from '@angular/router';
import { Vet } from '../../../models/Vets/vet-cl';
import { ItemTratamientoDto } from '../../../models/dtos/item-tratamiento-dto';
import { CardVerComponent } from './card-ver/card-ver.component';
import { CardDonaComponent } from '../../admin/dashboard/card-dona/card-dona.component';
import { CardAccesoRapidoComponent } from './card-acceso-rapido/card-acceso-rapido.component';
import { TreatmentsCardComponent } from '../../reusables/treatments-card/treatments-card.component';
import { FiltrosEstadoService } from '../../../services/filtros-estado.service';
import { SemanaCitasComponent } from './semana-citas/semana-citas.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardVerComponent,
    CardDonaComponent,
    CardAccesoRapidoComponent,
    TreatmentsCardComponent,
    SemanaCitasComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  vetId: number = 0;
  vet: Vet = new Vet();
  vetLoaded = false;
  tratamientos: ItemTratamientoDto[] = [];
  numTratamientosByVet: number = 0;
  numPets: number = 0;
  numPetsActivos: number = 0;
  numPetsInactivos: number = 0;
  numClients: number = 0;

  constructor(
    private route: ActivatedRoute,
    private vetService: VetService,
    private petService: PetService,
    private clientService: ClientService,
    private tratamientoService: TratamientoService,
    private filtrosEstadoService: FiltrosEstadoService,
  ) {}

  ngOnInit(): void {
    this.filtrosEstadoService.limpiarTodo();

    this.vetService.getDetails().subscribe({
      next: (vet) => {
        this.vet = vet;
        this.vetLoaded = true;

        this.vetId = this.vet.id!;

        this.vetService.countTratamientosByVet(this.vetId).subscribe({
          next: (count) => {
            this.numTratamientosByVet = count;
          },
        });

        this.vetService.findTratamientosByVet(this.vetId).subscribe({
          next: (tratamientos) => {
            this.tratamientos = tratamientos;
          },
          error: (error) => {
            console.error(
              'Error cargando tratamientos del veterinario:',
              error,
            );
          },
        });
      },
    });

    this.petService.countPets().subscribe({
      next: (count) => {
        this.numPets = count;
      },
    });

    this.petService.countPetsActivos().subscribe({
      next: (count) => {
        this.numPetsActivos = count;
      },
    });

    this.petService.countPetsInactivos().subscribe({
      next: (count) => {
        this.numPetsInactivos = count;
      },
    });

    this.clientService.countClients().subscribe({
      next: (count) => {
        this.numClients = count;
      },
    });
  }
}
