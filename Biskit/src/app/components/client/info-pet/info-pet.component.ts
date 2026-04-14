import { Component, Input } from '@angular/core';
import { Client } from '../../../models/Client/client';
import { Pet } from '../../../models/Pets/pet';
import { TreatmentsSectionComponent } from './treatments-section/treatments-section.component';
import { PetCardComponent } from './pet-card/pet-card.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { TratamientoService } from '../../../services/tratamiento.service';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';

@Component({
  selector: 'app-info-pet',
  templateUrl: './info-pet.component.html',
  standalone: true,
  imports: [PetCardComponent, TreatmentsSectionComponent, RouterLink],
})
export class InfoPetComponent {
  @Input() client!: Client;
  @Input() pet!: Pet;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private tratamientoService: TratamientoService,
  ) {}

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');
    this.petService
      .findById(petId ? Number(petId) : 0)
      .pipe(
        mergeMap((pet) => {
          this.pet = pet;
          return this.tratamientoService.findTratamientosPet(pet.id ?? 0);
        }),
      )
      .subscribe((tratamientos) => {
        this.pet.tratamientos = tratamientos;
      });
  }
}
