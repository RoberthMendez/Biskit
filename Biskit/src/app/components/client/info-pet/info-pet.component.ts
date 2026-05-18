import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/Client/client';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { ItemTratamientoDto } from '../../../models/dtos/item-tratamiento-dto';
import { TreatmentsCardComponent } from '../../reusables/treatments-card/treatments-card.component';
import { PetCardComponent } from './pet-card/pet-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { mergeMap } from 'rxjs';
import { ClientService } from '../../../services/client.service';
import { BackButtonComponent } from '../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-info-pet',
  templateUrl: './info-pet.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PetCardComponent,
    TreatmentsCardComponent,
    BackButtonComponent,
  ],
})
export class InfoPetComponent {
  @Input() client: Client = new Client();
  @Input() pet: PetDTO & { tratamientos?: ItemTratamientoDto[] } = new PetDTO();

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');

    this.clientService
      .getDetails()
      .pipe(
        mergeMap((client) => {
          this.client = client;
          return this.petService.findById(petId ? Number(petId) : 0);
        }),
        mergeMap((pet) => {
          this.pet = pet;
          return this.petService.getPetTratamientos(pet.id ?? 0);
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
