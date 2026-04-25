import { Component } from '@angular/core';
import { VetService } from '../../../services/vet.service';
import { PetService } from '../../../services/pet.service';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  vetId: number = 0;
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
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.vetId = id ? Number(id) : 0;

    this.vetService.countTratamientosByVet(this.vetId).subscribe({
      next: (count) => {
        this.numTratamientosByVet = count;
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
