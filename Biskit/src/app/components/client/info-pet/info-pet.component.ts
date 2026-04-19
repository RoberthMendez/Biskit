import { Component, Input } from '@angular/core';
import { Client } from '../../../models/Client/client';
import { Pet } from '../../../models/Pets/pet';
import { TreatmentsSectionComponent } from './treatments-section/treatments-section.component';
import { PetCardComponent } from './pet-card/pet-card.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { mergeMap } from 'rxjs';
import { TratamientoService } from '../../../services/tratamiento.service';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-info-pet',
  templateUrl: './info-pet.component.html',
  standalone: true,
  imports: [PetCardComponent, TreatmentsSectionComponent, RouterLink],
})
export class InfoPetComponent {
  @Input() client: Client = new Client();
  @Input() pet: Pet = new Pet();

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private clientService: ClientService,
    private tratamientoService: TratamientoService,
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');
    const clientId = this.route.snapshot.paramMap.get('clientId');

    this.clientService
      .findById(clientId ? Number(clientId) : 0)
      .pipe(
        mergeMap((client) => {
          this.client = client;
          return this.petService.findById(petId ? Number(petId) : 0);
        }),
        mergeMap((pet) => {
          this.pet = pet;
          return this.tratamientoService.findTratamientosPet(pet.id ?? 0);
        }),
      )
      .subscribe({
        next: (tratamientos) => {
          this.pet.tratamientos = tratamientos;
        },
        error: () => {
          this.pet.tratamientos = [];
        },
      });
  }
}
